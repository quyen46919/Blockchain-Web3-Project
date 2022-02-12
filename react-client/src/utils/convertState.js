export function convertState(state) {
    switch (Number(state)) {
    case 0:
        return 'Tạo sản phẩm';
    case 1:
        return 'Đã thanh toán';
    case 2:
        return 'Đã giao hàng';
    default:
        return 'Tạo sản phẩm';
    }
}