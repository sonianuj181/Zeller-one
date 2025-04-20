export type Product = {
    sku: string;
    name: string;
    price: number;
    _applied?:boolean
  };
  
  interface PricingRule {
    apply(items: Product[]): number;
  }
  
  export class Checkout {
    private pricingRules: PricingRule[];
    private scannedItems: Product[] = [];
  
    constructor(pricingRules: PricingRule[]) {
      this.pricingRules = pricingRules;
    }
  
    scan(item: Product) {
      this.scannedItems.push(item);
    }
  
    total(): number {
      let total = 0;
      let remainingItems = [...this.scannedItems];
  
      for (const rule of this.pricingRules) {
        total += rule.apply(remainingItems);
        // Remove items handled by pricing rules
        remainingItems = remainingItems.filter(item => !item["_applied"]);
      }
  
      // Add any remaining items (not handled by any pricing rule)
      for (const item of remainingItems) {
        total += item.price;
      }

      return parseFloat(total.toFixed(2));
    }
  }
   export const products: { [sku: string]: Product } = {
    ipd: { sku: "ipd", name: "Super iPad", price: 549.99 },
    mbp: { sku: "mbp", name: "MacBook Pro", price: 1399.99 },
    atv: { sku: "atv", name: "Apple TV", price: 109.50 },
    vga: { sku: "vga", name: "VGA adapter", price: 30.00 }
  };
  export class ThreeForTwoRule implements PricingRule {
    constructor(private sku: string, private unitPrice: number) {}
  
    apply(items: Product[]): number {
      const matching = items.filter(item => item.sku === this.sku);
      matching.forEach(item => (item["_applied"] = true));
  
      const setsOfThree = Math.floor(matching.length / 3);
      const remaining = matching.length % 3;
      return (setsOfThree * 2 + remaining) * this.unitPrice;
    }
  }
  export class BulkDiscountRule implements PricingRule {
    constructor(
      private sku: string,
      private minQty: number,
      private discountedPrice: number
    ) {}
  
    apply(items: Product[]): number {
      const matching = items.filter(item => item.sku === this.sku);

      matching.forEach(item => (item["_applied"] = true));

  let price;
  if(matching.length > this.minQty ){
    price = this.discountedPrice;
  }
  else{
   
    price = matching[0]?.price || 0 ;
  }
  
   
      return matching.length * price;
    }
  }
  const pricingRules: PricingRule[] = [
    new ThreeForTwoRule("atv", products["atv"].price),
    new BulkDiscountRule("ipd", 4, 499.99)
  ];
  
