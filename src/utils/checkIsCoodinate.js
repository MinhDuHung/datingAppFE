export function isCoordinateStringValid(coordString) {
    // Biểu thức chính quy để kiểm tra định dạng của chuỗi tọa độ
    const coordinateRegex = /^[-+]?\d+(\.\d+)?\s*[-+]?\d+(\.\d+)?$/;

    // Kiểm tra xem chuỗi có khớp với biểu thức chính quy không
    return coordinateRegex.test(coordString);
}

export function parseCoordinateString(coordString) {
    // Biểu thức chính quy để phân tích chuỗi tọa độ
    const coordinateRegex = /^([-+]?\d+(\.\d+)?)\s*([-+]?\d+(\.\d+)?)$/;

    // Kiểm tra xem chuỗi có khớp với biểu thức chính quy không
    const match = coordString.match(coordinateRegex);

    // Nếu có khớp, trích xuất giá trị latitude và longitude từ các nhóm phù hợp
    if (match) {
        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[3]);

        // Kiểm tra xem giá trị latitude và longitude có nằm trong khoảng hợp lệ không
        if (!isNaN(latitude) && !isNaN(longitude)) {
            return { latitude, longitude };
        }
    }

    // Trả về null nếu không thể chuyển đổi
    return null;
}
