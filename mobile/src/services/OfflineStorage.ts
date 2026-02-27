import AsyncStorage from '@react-native-async-storage/async-storage';

interface Document {
  id: string;
  fileName: string;
  fileUri: string;
  uploadDate: string;
  synced: boolean;
}

class OfflineStorage {
  private DOCUMENTS_KEY = '@sahayak_documents';
  private QUEUE_KEY = '@sahayak_upload_queue';

  // Save document locally
  async saveDocument(document: Document): Promise<void> {
    try {
      const documents = await this.getDocuments();
      documents.push(document);
      await AsyncStorage.setItem(this.DOCUMENTS_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving document:', error);
      throw error;
    }
  }

  // Get all documents
  async getDocuments(): Promise<Document[]> {
    try {
      const data = await AsyncStorage.getItem(this.DOCUMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }

  // Add to upload queue
  async addToUploadQueue(document: Document): Promise<void> {
    try {
      const queue = await this.getUploadQueue();
      queue.push(document);
      await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error adding to queue:', error);
      throw error;
    }
  }

  // Get upload queue
  async getUploadQueue(): Promise<Document[]> {
    try {
      const data = await AsyncStorage.getItem(this.QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting queue:', error);
      return [];
    }
  }

  // Remove from queue after successful upload
  async removeFromQueue(documentId: string): Promise<void> {
    try {
      const queue = await this.getUploadQueue();
      const filtered = queue.filter(doc => doc.id !== documentId);
      await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from queue:', error);
      throw error;
    }
  }

  // Mark document as synced
  async markAsSynced(documentId: string): Promise<void> {
    try {
      const documents = await this.getDocuments();
      const updated = documents.map(doc =>
        doc.id === documentId ? { ...doc, synced: true } : doc
      );
      await AsyncStorage.setItem(this.DOCUMENTS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking as synced:', error);
      throw error;
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.DOCUMENTS_KEY, this.QUEUE_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

export default new OfflineStorage();
