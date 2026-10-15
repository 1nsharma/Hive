/**
 * 🧠 Knowledge Graph Layer
 * Represents the relationships between different business entities.
 */

import { GraphNodeType, GraphEdge } from './models';

export class BusinessKnowledgeGraph {
  private nodes: Map<string, any> = new Map();
  private edges: GraphEdge[] = [];

  constructor(private tenantId: string) {}

  addNode(id: string, type: GraphNodeType, data: any) {
    this.nodes.set(id, { id, type, data });
  }

  addEdge(fromId: string, fromType: GraphNodeType, toId: string, toType: GraphNodeType, relation: string) {
    this.edges.push({ fromId, fromType, toId, toType, relation });
  }

  getRelatedNodes(nodeId: string, relationType?: string): any[] {
    return this.edges
      .filter(edge => edge.fromId === nodeId && (!relationType || edge.relation === relationType))
      .map(edge => this.nodes.get(edge.toId))
      .filter(Boolean);
  }

  // Example traversals for AI context:
  
  /**
   * For a given customer, trace their Udhaar, recent orders, and the products they bought.
   */
  getCustomerContext(customerId: string) {
    const orders = this.getRelatedNodes(customerId, 'PLACED_ORDER');
    const udhaar = this.getRelatedNodes(customerId, 'HAS_UDHAAR');
    return {
      orders,
      udhaar
    };
  }

  /**
   * Find which suppliers supply the products that are currently low in stock.
   */
  getSupplierForLowStock(inventoryId: string) {
    const products = this.getRelatedNodes(inventoryId, 'CONTAINS_PRODUCT');
    const suppliers = products.flatMap(p => this.getRelatedNodes(p.id, 'SUPPLIED_BY'));
    return suppliers;
  }
}
