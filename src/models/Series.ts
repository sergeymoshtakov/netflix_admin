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
  genres?: Genre[];
  actors?: Actor[];
  episodes?: Episode[];
  warnings?: Warning[];
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
}

export interface Actor {
  id: number;
  name: string;
  surname: string;
  biography?: string;
}

export interface ContentGenre {
  id: number;
  contentId: number;
  genreId: number;
}

export interface ContentActor {
  id: number;
  contentId: number;
  actorId: number;
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

export interface ContentWarning {
  id: number;
  contentId: number;
  warningId: number;
}
