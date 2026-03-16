import { Delivery } from '../../users/entities/delivery.entity';
import { User } from '../../users/entities/user.entity';

export interface ProfileCompletenessResult {
  profileComplete: boolean;
  profileCompleteness: number;
  missingFields: string[];
  warnings: string[];
}

export function calculateProfileCompleteness(
  user: User,
): ProfileCompletenessResult {
  const missingFields: string[] = [];
  const warnings: string[] = [];
  let completeness = 0;

  if (user instanceof Delivery) {
    // Base: 40%
    completeness = 40;

    // Location: +20%
    if (user.location) {
      completeness += 20;
    } else {
      missingFields.push('location');
      warnings.push('Add your location to improve your profile (20%)');
    }

    // Rate & VehicleType: +20%
    if (user.rate !== null && user.rate !== undefined && user.vehicleType) {
      completeness += 20;
    } else {
      if (user.rate === null || user.rate === undefined) {
        missingFields.push('rate');
      }
      if (!user.vehicleType) {
        missingFields.push('vehicleType');
      }
      warnings.push(
        'Add your rate and vehicle type to improve your profile (20%)',
      );
    }

    // Documents: +20%
    if (user.docVerification) {
      completeness += 20;
      if (user.docVerification.status !== 'approved') {
        warnings.push(
          `Your documents are ${user.docVerification.status}. Approved documents are required to start accepting deliveries.`,
        );
      }
    } else {
      missingFields.push('documents');
      warnings.push('Upload your documents to complete your profile (20%)');
    }
  } else {
    // Admin/Agency: base 80%
    completeness = 80;

    if (user.location) {
      completeness += 20;
    } else {
      missingFields.push('location');
      warnings.push('Add your location to complete your profile (20%)');
    }
  }

  return {
    profileComplete: completeness === 100,
    profileCompleteness: completeness,
    missingFields,
    warnings,
  };
}
