import subscriptionImage from "@assets/generated_images/friendly_tech_buddy_subscription_portrait.png";
import sessionImage from "@assets/generated_images/tech_mentor_one-time_session_portrait.png";
import bundleImage from "@assets/generated_images/tech_companion_bundle_package_portrait.png";
import couponSaverImage from "@assets/generated_images/ai_coupon_book_savings_illustration.png";

const productImages: Record<string, string> = {
  "monthly-subscription": subscriptionImage,
  "one-time-session": sessionImage,
  "bundle-package": bundleImage,
  "bitforce-saver": couponSaverImage,
};

export function getProductImage(slug: string): string {
  return productImages[slug] || "";
}
