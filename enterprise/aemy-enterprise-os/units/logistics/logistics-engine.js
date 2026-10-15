import { enterpriseBus } from "../../core/bus-event.js";

export const BreakdownStatus = {
  REPORTED: "REPORTED",
  ASSIGNED: "ASSIGNED",
  DISPATCHED: "DISPATCHED",
  IN_REPAIR: "IN_REPAIR",
  RESOLVED: "RESOLVED"
};

export class LogisticsEngine {
  constructor() {
    this.tickets = [];
    this.servicePartners = [
      { id: "P1", name: "Sharma Highway Garage", location: "NH-48 KM 120", active: true },
      { id: "P2", name: "National Truck Point", location: "NH-8 KM 85", active: true },
      { id: "P3", name: "Rajdhani Mobile Workshop", location: "NH-52 KM 40", active: true }
    ];
  }

  createBreakdownTicket(tenantId, data) {
    const { truckNumber, driverName, driverPhone, highwayLocation, issueDescription, distanceKm = 15 } = data;
    
    // Cost estimation calculation
    const baseFee = 499;
    const distanceCharge = Math.max(0, distanceKm - 5) * 25; // ₹25/km beyond 5km
    const estimatedCost = baseFee + distanceCharge;

    const ticket = {
      id: `TW-${Date.now().toString().slice(-6)}`,
      tenantId,
      truckNumber: truckNumber.toUpperCase(),
      driverName,
      driverPhone,
      highwayLocation,
      issueDescription,
      distanceKm,
      estimatedCost,
      finalCost: estimatedCost,
      status: BreakdownStatus.REPORTED,
      assignedPartner: null,
      createdAt: new Date().toISOString()
    };

    this.tickets.push(ticket);

    enterpriseBus.publish(tenantId, "LOGISTICS_BREAKDOWN_REPORTED", {
      ticketId: ticket.id,
      truckNumber: ticket.truckNumber,
      estimatedCost: ticket.estimatedCost
    });

    return ticket;
  }

  assignNearestPartner(ticketId) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error(`Ticket ${ticketId} not found`);

    const partner = this.servicePartners.find(p => p.active) || this.servicePartners[0];
    ticket.assignedPartner = partner.name;
    ticket.status = BreakdownStatus.ASSIGNED;

    enterpriseBus.publish(ticket.tenantId, "LOGISTICS_PARTNER_ASSIGNED", {
      ticketId: ticket.id,
      partner: partner.name
    });

    return ticket;
  }

  updateTicketStatus(ticketId, nextStatus, partsCost = 0) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error(`Ticket ${ticketId} not found`);

    ticket.status = nextStatus;
    if (partsCost > 0) {
      ticket.finalCost += partsCost;
    }

    enterpriseBus.publish(ticket.tenantId, `LOGISTICS_STATUS_${nextStatus}`, {
      ticketId: ticket.id,
      status: nextStatus,
      finalCost: ticket.finalCost
    });

    return ticket;
  }

  getAllTickets() {
    return [...this.tickets];
  }
}

export const logisticsEngine = new LogisticsEngine();
