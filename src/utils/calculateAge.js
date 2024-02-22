export function calculateAge(dateOfBirthString) {
    // Chuyển đổi chuỗi ngày thành đối tượng ngày
    const dateOfBirth = new Date(dateOfBirthString);

    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Tính tuổi
    let age = currentDate.getFullYear() - dateOfBirth.getFullYear();

    // Kiểm tra xem ngày hiện tại đã qua ngày sinh chưa trong năm nay
    if (
        currentDate.getMonth() < dateOfBirth.getMonth() ||
        (currentDate.getMonth() === dateOfBirth.getMonth() &&
            currentDate.getDate() < dateOfBirth.getDate())
    ) {
        age--;
    }

    return age;
}