import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.scholarships.list.path, async (req, res) => {
    const list = await storage.getScholarships();
    res.json(list);
  });

  app.get(api.scholarships.get.path, async (req, res) => {
    const item = await storage.getScholarship(Number(req.params.id));
    if (!item) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    res.json(item);
  });

  app.post(api.scholarships.create.path, async (req, res) => {
    try {
      const input = api.scholarships.create.input.parse(req.body);
      const item = await storage.createScholarship(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.scholarships.update.path, async (req, res) => {
    try {
      const input = api.scholarships.update.input.parse(req.body);
      const updated = await storage.updateScholarship(Number(req.params.id), input);
      if (!updated) {
        return res.status(404).json({ message: 'Scholarship not found' });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.scholarships.delete.path, async (req, res) => {
    await storage.deleteScholarship(Number(req.params.id));
    res.status(204).send();
  });

  return httpServer;
}

// Seed function to populate database with sample data
async function seedDatabase() {
  const existing = await storage.getScholarships();
  if (existing.length === 0) {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    await storage.createScholarship({
      scholarshipName: "Knight-Hennessy Scholarship",
      universityName: "Stanford University",
      country: "USA",
      fundingType: "Full",
      professorEmail: "admissions@stanford.edu",
      requiredDocuments: ["CV", "Statement of Purpose", "3 Letters of Recommendation"],
      deadline: nextMonth,
      status: "Applied",
      applyLink: "https://stanford.edu/apply",
      notes: "High priority application"
    });

    await storage.createScholarship({
      scholarshipName: "Gates Cambridge Scholarship",
      universityName: "University of Cambridge",
      country: "UK",
      fundingType: "Partial",
      professorEmail: "contact@cam.ac.uk",
      requiredDocuments: ["CV", "Research Proposal"],
      deadline: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 45), // 45 days
      status: "Preparing",
      applyLink: "https://cam.ac.uk/apply",
      notes: "Need to finish research proposal"
    });

    await storage.createScholarship({
      scholarshipName: "ETH Excellence Scholarship",
      universityName: "ETH Zurich",
      country: "Switzerland",
      fundingType: "Full",
      professorEmail: "info@ethz.ch",
      requiredDocuments: ["Transcripts", "CV"],
      deadline: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
      status: "Submitted",
      applyLink: "https://ethz.ch/en.html",
      notes: "Waiting for interview call"
    });
  }
}

// Call seed in the background
seedDatabase().catch(console.error);
