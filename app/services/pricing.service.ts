import { supabase } from '@/app/lib/supabase';

export interface PricingCalculation {
  basePrice: number;
  days: number;
  discountPercentage: number;
  discountAmount: number;
  finalPricePerDay: number;
  totalPrice: number;
  breakdown: {
    subtotal: number;
    discount: number;
    total: number;
  };
}

export interface DiscountRule {
  id: string;
  property_id: string;
  min_days: number;
  max_days: number;
  discount_percentage: number;
  is_active: boolean;
}

/**
 * Calculate price for a property based on number of days and applicable discount rules
 */
export const calculatePropertyPrice = async (
  propertyId: string,
  basePrice: number,
  days: number
): Promise<PricingCalculation> => {
  // Find applicable discount rule
  const { data: rules, error } = await supabase
    .from('discount_rules')
    .select('*')
    .eq('property_id', propertyId)
    .eq('is_active', true)
    .lte('min_days', days)
    .gte('max_days', days)
    .order('discount_percentage', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching discount rules:', error);
  }

  const discountPercentage = rules && rules.length > 0 ? rules[0].discount_percentage : 0;
  const discountAmount = Math.round((basePrice * discountPercentage) / 100);
  const finalPricePerDay = basePrice - discountAmount;

  return {
    basePrice,
    days,
    discountPercentage,
    discountAmount,
    finalPricePerDay,
    totalPrice: finalPricePerDay * days,
    breakdown: {
      subtotal: basePrice * days,
      discount: discountAmount * days,
      total: finalPricePerDay * days,
    },
  };
};

/**
 * Get all discount rules for a property
 */
export const getDiscountRulesForProperty = async (
  propertyId: string
): Promise<DiscountRule[]> => {
  const { data, error } = await supabase
    .from('discount_rules')
    .select('*')
    .eq('property_id', propertyId)
    .order('min_days', { ascending: true });

  if (error) {
    console.error('Error fetching discount rules:', error);
    return [];
  }

  return data || [];
};

/**
 * Create a new discount rule
 */
export const createDiscountRule = async (
  rule: Omit<DiscountRule, 'id'>
): Promise<DiscountRule | null> => {
  const { data, error } = await supabase
    .from('discount_rules')
    .insert(rule)
    .select()
    .single();

  if (error) {
    console.error('Error creating discount rule:', error);
    return null;
  }

  return data;
};

/**
 * Update an existing discount rule
 */
export const updateDiscountRule = async (
  id: string,
  updates: Partial<Omit<DiscountRule, 'id'>>
): Promise<DiscountRule | null> => {
  const { data, error } = await supabase
    .from('discount_rules')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating discount rule:', error);
    return null;
  }

  return data;
};

/**
 * Delete a discount rule
 */
export const deleteDiscountRule = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('discount_rules')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting discount rule:', error);
    return false;
  }

  return true;
};
