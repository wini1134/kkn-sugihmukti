export type ProgramCategory = 'Semua' | 'Edukasi' | 'Digital' | 'Lingkungan' | 'Sosial' | 'Infrastruktur';

export interface BeforeAfterData {
  beforeImg: string;
  afterImg: string;
  beforeLabel: string;
  afterLabel: string;
  title: string;
  description: string;
}

export interface Program {
  id: string;
  title: string;
  category: ProgramCategory;
  tag: string;
  description: string;
  fullDescription: string;
  impactReport: string;
  image: string;
  location?: string;
  beneficiariesCount?: number;
  featured?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: string;
  major: string;
  photo: string;
  quote?: string;
  impressionMessage?: string;
  instagram?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Program Kerja' | 'Kebersamaan' | 'Behind The Scene' | 'Penutupan';
  image: string;
  caption: string;
  date: string;
  location?: string;
}

export interface VideoMemory {
  id: string;
  title: string;
  category: 'After Movie' | 'Highlight' | 'Reels';
  duration: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  tag?: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  status: string; // e.g. "Warga Sugihmukti", "Alumni KKN", "Pengunjung Website"
  message: string;
  date: string;
  likes: number;
}

export interface TimelineStep {
  id: string;
  monthYear: string;
  title: string;
  description: string;
  iconName: string;
  highlights: string[];
}
