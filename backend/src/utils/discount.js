function calculate_discount(purchases_count = 0) {
  if (purchases_count >= 1 && purchases_count <= 3) {
    return 5;
  }

  if (purchases_count >= 4 && purchases_count <= 7) {
    return 10;
  }

  if (purchases_count >= 8) {
    return 15;
  }

  return 0;
}

export { calculate_discount };
