import axios from 'axios';
import { toast } from 'sonner';

export interface TrackingResult {
  trackingNumber: string;
  carrier: string;
  status: {
    code: 'delivered' | 'in_transit' | 'out_for_delivery' | 'pending' | 'exception';
    label: string;
    color: 'success' | 'primary' | 'warning' | 'error';
  };
  estimatedDelivery?: string;
  history: TrackingEvent[];
}

export interface TrackingEvent {
  date: string;
  location: string;
  status: string;
  description: string;
}

export interface TrackingOptions {
  carrier?: string;
}

export const trackingService = {
  async trackPackage(trackingNumber: string, options: TrackingOptions = {}): Promise<TrackingResult> {
    try {
      // Validate tracking number
      if (!trackingNumber || trackingNumber.length < 5) {
        throw new Error("Numéro de suivi invalide");
      }

      // In a production environment, you would call the 17track API
      // For now, we'll simulate the API call with a mock response
      const response = await this.simulateApiCall(trackingNumber, options.carrier);
      
      // Save to recent trackings in localStorage
      this.saveToRecentTrackings(response);
      
      return response;
    } catch (error: any) {
      console.error('Error tracking package:', error);
      throw new Error(error.message || "Une erreur est survenue lors du suivi du colis");
    }
  },

  async simulateApiCall(trackingNumber: string, carrier?: string): Promise<TrackingResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a deterministic but random-looking status based on the tracking number
    const hash = this.simpleHash(trackingNumber);
    const statusIndex = hash % 5;
    
    const statuses = [
      { code: 'delivered', label: 'Livré', color: 'success' },
      { code: 'in_transit', label: 'En transit', color: 'primary' },
      { code: 'out_for_delivery', label: 'En cours de livraison', color: 'primary' },
      { code: 'pending', label: 'En attente', color: 'warning' },
      { code: 'exception', label: 'Problème de livraison', color: 'error' }
    ] as const;
    
    const status = statuses[statusIndex];
    
    // Detect carrier if not provided
    const detectedCarrier = carrier || this.detectCarrier(trackingNumber);
    
    // Generate history based on status
    const history = this.generateHistory(trackingNumber, status.code);
    
    // Generate estimated delivery date for non-delivered packages
    const estimatedDelivery = status.code !== 'delivered' 
      ? this.generateEstimatedDelivery() 
      : undefined;
    
    return {
      trackingNumber,
      carrier: detectedCarrier,
      status,
      estimatedDelivery,
      history
    };
  },

  async track17Track(trackingNumber: string, carrier?: string): Promise<TrackingResult> {
    try {
      const apiKey = import.meta.env.VITE_17TRACK_API_KEY;
      const apiSecret = import.meta.env.VITE_17TRACK_API_SECRET;
      
      if (!apiKey || !apiSecret) {
        throw new Error('17Track API credentials not configured');
      }
      
      const response = await axios.post(
        'https://api.17track.net/track/v2/gettrackinfo',
        {
          tracking_number: trackingNumber,
          carrier_code: carrier
        },
        {
          headers: {
            '17token': apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.code !== 0) {
        throw new Error(response.data.message || 'Error tracking package');
      }
      
      // Process and transform the 17track response to our format
      return this.process17TrackResponse(response.data, trackingNumber);
    } catch (error: any) {
      console.error('Error calling 17Track API:', error);
      throw new Error(error.message || 'Error tracking package');
    }
  },
  
  process17TrackResponse(data: any, trackingNumber: string): TrackingResult {
    // This would need to be implemented based on the actual API response structure
    // For now, we'll just return a mock response
    return this.simulateApiCall(trackingNumber);
  },

  detectCarrier(trackingNumber: string): string {
    // Simple carrier detection based on tracking number format
    // In a real implementation, this would be more sophisticated or use the 17track API
    if (/^1Z[0-9A-Z]{16}$/.test(trackingNumber)) {
      return 'UPS';
    } else if (/^[0-9]{12}$/.test(trackingNumber)) {
      return 'FedEx';
    } else if (/^[0-9]{10}$/.test(trackingNumber)) {
      return 'DHL';
    } else if (/^[A-Z]{2}[0-9]{9}[A-Z]{2}$/.test(trackingNumber)) {
      return 'USPS';
    } else if (/^[0-9]{13}$/.test(trackingNumber)) {
      return 'La Poste';
    } else {
      // Randomly select a carrier for demo purposes
      const carriers = ['FedEx', 'UPS', 'DHL', 'La Poste', 'Colissimo'];
      return carriers[this.simpleHash(trackingNumber) % carriers.length];
    }
  },

  generateHistory(trackingNumber: string, status: string): TrackingEvent[] {
    const today = new Date();
    const history: TrackingEvent[] = [];
    
    // Add shipping event (oldest)
    const shippingDate = new Date(today);
    shippingDate.setDate(today.getDate() - 5);
    history.push({
      date: shippingDate.toLocaleString(),
      location: 'Entrepôt expéditeur',
      status: 'Colis expédié',
      description: 'Le colis a été expédié par le vendeur'
    });
    
    // Add processing event
    const processingDate = new Date(today);
    processingDate.setDate(today.getDate() - 4);
    history.push({
      date: processingDate.toLocaleString(),
      location: 'Centre de tri national',
      status: 'Colis reçu',
      description: 'Le colis a été reçu et est en cours de traitement'
    });
    
    // Add transit event
    const transitDate = new Date(today);
    transitDate.setDate(today.getDate() - 2);
    history.push({
      date: transitDate.toLocaleString(),
      location: 'Centre de tri régional',
      status: 'En transit',
      description: 'Le colis est en cours d\'acheminement'
    });
    
    // Add additional events based on status
    if (['delivered', 'out_for_delivery', 'in_transit', 'exception'].includes(status)) {
      const localHubDate = new Date(today);
      localHubDate.setDate(today.getDate() - 1);
      history.push({
        date: localHubDate.toLocaleString(),
        location: 'Centre de distribution local',
        status: status === 'exception' ? 'Problème de livraison' : 'En cours de livraison',
        description: status === 'exception' ? 'Adresse incomplète' : 'Le colis est en cours de livraison'
      });
    }
    
    // Add delivery event for delivered packages
    if (status === 'delivered') {
      const deliveryDate = new Date(today);
      deliveryDate.setHours(today.getHours() - 2);
      history.push({
        date: deliveryDate.toLocaleString(),
        location: 'Adresse de livraison',
        status: 'Colis livré',
        description: 'Le colis a été livré au destinataire'
      });
    }
    
    // Sort history from oldest to newest
    return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  generateEstimatedDelivery(): string {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toLocaleDateString();
  },

  simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  },
  
  saveToRecentTrackings(tracking: TrackingResult): void {
    try {
      // Get existing trackings from localStorage
      const existingTrackings = localStorage.getItem('recentTrackings');
      let trackings = existingTrackings ? JSON.parse(existingTrackings) : [];
      
      // Check if this tracking number already exists
      const existingIndex = trackings.findIndex((t: any) => 
        t.trackingNumber === tracking.trackingNumber
      );
      
      // Create tracking entry
      const trackingEntry = {
        id: Date.now().toString(),
        trackingNumber: tracking.trackingNumber,
        carrier: tracking.carrier,
        status: tracking.status,
        lastChecked: new Date().toISOString()
      };
      
      // Update or add the tracking
      if (existingIndex !== -1) {
        trackings[existingIndex] = trackingEntry;
      } else {
        // Add to the beginning of the array
        trackings.unshift(trackingEntry);
        // Limit to 5 recent trackings
        trackings = trackings.slice(0, 5);
      }
      
      // Save back to localStorage
      localStorage.setItem('recentTrackings', JSON.stringify(trackings));
    } catch (error) {
      console.error('Error saving to recent trackings:', error);
    }
  },
  
  getRecentTrackings(): any[] {
    try {
      const trackings = localStorage.getItem('recentTrackings');
      return trackings ? JSON.parse(trackings) : [];
    } catch (error) {
      console.error('Error getting recent trackings:', error);
      return [];
    }
  }
};