

import { Checkout, ThreeForTwoRule, BulkDiscountRule, products } from '../src/index';

describe('Checkout System', () => {
  let checkout: Checkout;
  
  beforeEach(() => {
    
    const pricingRules = [
      new ThreeForTwoRule('atv', products['atv'].price),
      new BulkDiscountRule('ipd', 4, 499.99)
    ];
    checkout = new Checkout(pricingRules);
  });

  describe('ThreeForTwoRule', () => {
    test('should apply 3 for 2 deal on Apple TV', () => {

      checkout.scan(products['atv']);
      checkout.scan(products['atv']);
      checkout.scan(products['atv']);

     
      expect(checkout.total()).toBe(219.00);
    });

    test('should correctly handle 4 Apple TVs', () => {
    
      checkout.scan(products['atv']);
      checkout.scan(products['atv']);
      checkout.scan(products['atv']);
      checkout.scan(products['atv']);

   
      expect(checkout.total()).toBe(328.50); 
    });
  });

  describe('BulkDiscountRule', () => {
    test('should apply bulk discount when buying 4 or more iPads', () => {
      
      checkout.scan(products['ipd']);
      checkout.scan(products['ipd']);
      checkout.scan(products['ipd']);
      checkout.scan(products['ipd']);

      
      expect(checkout.total()).toBe(2199.96); 
    });

    test('should use regular price when buying less than 4 iPads', () => {
   
      checkout.scan(products['ipd']);
      checkout.scan(products['ipd']);
      checkout.scan(products['ipd']);

      
      expect(checkout.total()).toBe(1649.97); 
    });
  });

  describe('Mixed Items', () => {
    test('should correctly handle mixed items with different rules', () => {
      checkout.scan(products['atv']);
      checkout.scan(products['ipd']);
      checkout.scan(products['ipd']);
      checkout.scan(products['atv']);
      checkout.scan(products['ipd']);
      checkout.scan(products['ipd']);
      checkout.scan(products['atv']);


      expect(checkout.total()).toBe(2418.96);
    });

    test('should handle items with no special rules', () => {
      checkout.scan(products['vga']);
      checkout.scan(products['mbp']);

      expect(checkout.total()).toBe(1429.99); 
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty checkout', () => {
      expect(checkout.total()).toBe(0);
    });

    test('should handle single item checkout', () => {
      checkout.scan(products['vga']);
      expect(checkout.total()).toBe(30.00);
    });

    test('should handle multiple scans of the same item', () => {
      checkout.scan(products['vga']);
      checkout.scan(products['vga']);
      checkout.scan(products['vga']);
      expect(checkout.total()).toBe(90.00); 
    });
  });
});
