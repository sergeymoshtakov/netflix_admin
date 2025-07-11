export interface ContentType {
  id: number;
  name: string;
  description: string;
  tags: string;
}

export interface Content {
  id: number;
  name: string;
  contentTypeId: number;
  posterUrl?: string;
  trailerUrl?: string;
  videoUrl?: string;
  description?: string;
  durationMin?: number;
  ageRating?: string;
  releaseDate?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  genreIds?: number[];
  actorIds?: number[];
  warningIds?: number[];
  posterFile?: File;
  trailerFile?: File;
  videoFile?: File;
}

export interface Episode {
  id: number;
  name: string;
  contentId: number;
  seasonNumber: number;
  episodeNumber: number;
  durationMin?: number;
  description?: string;
  trailerUrl?: string;
  videoUrl?: string;
  releaseDate?: string;
  createdAt?: string;
}

export interface Genre {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  tags: string;
}

export interface Actor {
  id: number;
  name: string;
  surname: string;
  biography?: string;
}

export interface WishList {
  id: number;
  userId: number;
  contentId: number;
  createdAt?: string;
}

export interface Warning {
  id: number;
  name: string;
}
