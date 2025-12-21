import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
}

export interface MetricData {
  label: string;
  value: string;
  subtext: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface CaseStudy {
  title: string;
  before: string;
  after: string;
  outcome: string;
  metric?: {
    label: string;
    value: number; // e.g. hours saved
    unit: string;
  };
}

export interface ExampleApp {
  name: string;
  category: 'Logistics' | 'Safety' | 'Facilities' | 'Other';
  problem: string;
  outcome: string;
  icon: LucideIcon;
}

export interface Inquiry {
  id: number;
  created_at: string;
  name: string;
  email: string;
  problem: string;
  file_url?: string;
}

export interface AboutContent {
  id: number;
  created_at?: string;
  updated_at?: string;
  experience_title: string;
  experience_body: string;
  experience_bullets: string[];
  experience_image_url?: string;
  experience_image_alt?: string;
  is_active: boolean;
}