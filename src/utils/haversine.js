function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

export function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Đường kính trung bình của Trái Đất trong km
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Khoảng cách theo đường chéo trên bề mặt hình cầu

    return `${distance.toFixed(0)} km`;
}

