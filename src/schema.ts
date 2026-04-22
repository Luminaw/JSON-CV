import { z } from "zod";

const iso8601 = z.string().regex(/^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3})$/).optional();

export const ResumeSchema = z.object({
  basics: z.object({
    name: z.string().optional(),
    label: z.string().optional(),
    image: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    url: z.string().url().optional(),
    summary: z.string().optional(),
    location: z.object({
      address: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
      countryCode: z.string().optional(),
      region: z.string().optional(),
    }).optional(),
    profiles: z.array(z.object({
      network: z.string().optional(),
      username: z.string().optional(),
      url: z.string().url().optional(),
    })).optional(),
  }).optional(),
  work: z.array(z.object({
    name: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    position: z.string().optional(),
    url: z.string().url().optional(),
    startDate: iso8601,
    endDate: iso8601,
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional(),
  })).optional(),
  volunteer: z.array(z.object({
    organization: z.string().optional(),
    position: z.string().optional(),
    url: z.string().url().optional(),
    startDate: iso8601,
    endDate: iso8601,
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional(),
  })).optional(),
  education: z.array(z.object({
    institution: z.string().optional(),
    url: z.string().url().optional(),
    area: z.string().optional(),
    studyType: z.string().optional(),
    startDate: iso8601,
    endDate: iso8601,
    score: z.string().optional(),
    courses: z.array(z.string()).optional(),
  })).optional(),
  awards: z.array(z.object({
    title: z.string().optional(),
    date: iso8601,
    awarder: z.string().optional(),
    summary: z.string().optional(),
  })).optional(),
  certificates: z.array(z.object({
    name: z.string().optional(),
    date: iso8601,
    url: z.string().url().optional(),
    issuer: z.string().optional(),
  })).optional(),
  publications: z.array(z.object({
    name: z.string().optional(),
    publisher: z.string().optional(),
    releaseDate: iso8601,
    url: z.string().url().optional(),
    summary: z.string().optional(),
  })).optional(),
  skills: z.array(z.object({
    name: z.string().optional(),
    level: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  })).optional(),
  languages: z.array(z.object({
    language: z.string().optional(),
    fluency: z.string().optional(),
  })).optional(),
  interests: z.array(z.object({
    name: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  })).optional(),
  references: z.array(z.object({
    name: z.string().optional(),
    reference: z.string().optional(),
  })).optional(),
  projects: z.array(z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    startDate: iso8601,
    endDate: iso8601,
    url: z.string().url().optional(),
    roles: z.array(z.string()).optional(),
    entity: z.string().optional(),
    type: z.string().optional(),
  })).optional(),
  meta: z.object({
    canonical: z.string().url().optional(),
    version: z.string().optional(),
    lastModified: z.string().optional(),
  }).optional(),
});

export type Resume = z.infer<typeof ResumeSchema>;
