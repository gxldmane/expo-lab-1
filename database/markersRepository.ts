import {
  MapMarker,
  MarkerImage,
  DatabaseMarker,
  DatabaseImage,
  CreateMarkerData,
  DatabaseTransaction,
} from "@/types";
import { databaseService } from "./service";
import { generateId } from "@/utils/helpers";

export class MarkersRepository {
  async createMarker(data: CreateMarkerData): Promise<string> {
    const markerId = generateId();
    const now = new Date().toISOString();
    const transaction: DatabaseTransaction = {
      queries: [
        {
          sql: `INSERT INTO markers (id, latitude, longitude, title, description, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [
            markerId,
            data.coordinate.latitude,
            data.coordinate.longitude,
            data.title || "",
            data.description || "",
            now,
            now,
          ],
        },
      ],
    };
    await databaseService.executeTransaction(transaction);
    return markerId;
  }

  async getAllMarkers(): Promise<MapMarker[]> {
    const markers = await databaseService.executeQuery<DatabaseMarker>(
      "SELECT * FROM markers ORDER BY created_at DESC"
    );
    const result: MapMarker[] = [];
    for (const marker of markers) {
      const images = await this.getMarkerImages(marker.id);
      result.push(this.mapDatabaseMarkerToMapMarker(marker, images));
    }
    return result;
  }
    async deleteMarker(markerId: string): Promise<void> {
    const transaction: DatabaseTransaction = {
      queries: [
        { sql: "DELETE FROM images WHERE marker_id = ?", args: [markerId] },
        { sql: "DELETE FROM markers WHERE id = ?", args: [markerId] },
      ],
    };
    await databaseService.executeTransaction(transaction);
  }

  async addImageToMarker(
    markerId: string,
    image: Omit<MarkerImage, "id">
  ): Promise<string> {
    const imageId = generateId();
    await databaseService.executeMutation(
      `INSERT INTO images (id, marker_id, uri, name, date_added, size, type) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        imageId,
        markerId,
        image.uri,
        image.name,
        image.dateAdded.toISOString(),
        image.size || null,
        image.type || null,
      ]
    );
    return imageId;
  }

  async removeImageFromMarker(imageId: string): Promise<void> {
    await databaseService.executeMutation("DELETE FROM images WHERE id = ?", [
      imageId,
    ]);
  }

  async getMarkerImages(markerId: string): Promise<MarkerImage[]> {
    const images = await databaseService.executeQuery<DatabaseImage>(
      "SELECT * FROM images WHERE marker_id = ? ORDER BY date_added ASC",
      [markerId]
    );
    return images.map(this.mapDatabaseImageToMarkerImage);
  }

  private mapDatabaseMarkerToMapMarker(
    dbMarker: DatabaseMarker,
    images: MarkerImage[]
  ): MapMarker {
    return {
      id: dbMarker.id,
      coordinate: {
        latitude: dbMarker.latitude,
        longitude: dbMarker.longitude,
      },
      title: dbMarker.title,
      description: dbMarker.description,
      images,
      createdAt: new Date(dbMarker.created_at),
      updatedAt: new Date(dbMarker.updated_at),
    };
  }

  private mapDatabaseImageToMarkerImage(dbImage: DatabaseImage): MarkerImage {
    const result: MarkerImage = {
      id: dbImage.id,
      uri: dbImage.uri,
      name: dbImage.name,
      dateAdded: new Date(dbImage.date_added),
    };
    if (dbImage.size !== null && dbImage.size !== undefined) {
      (result as any).size = dbImage.size;
    }
    if (dbImage.type !== null && dbImage.type !== undefined) {
      (result as any).type = dbImage.type;
    }
    return result;
  }
}

export const markersRepository = new MarkersRepository();
