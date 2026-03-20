// TODO: orders API 연동 후 params.id로 실제 데이터 조회
const MOCK_ORDER = {
  id: 'ORD-001',
  date: '2025-03-15',
  status: '배송완료',
  items: [
    { name: '상품 예시 A', quantity: 1, price: 35000, imageUrl: '' },
  ],
  shippingAddress: '서울시 강남구 테헤란로 123',
  recipient: '홍길동',
  phone: '010-1234-5678',
  totalPrice: 35000,
  shippingFee: 0,
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  // TODO: const order = await fetch(`/orders/${id}`)
  const order = { ...MOCK_ORDER, id };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">주문 상세</h2>

      {/* 주문 상태 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">{order.date}</p>
            <p className="text-sm font-medium text-gray-900 mt-0.5">주문번호: {order.id}</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700">
            {order.status}
          </span>
        </div>
      </div>

      {/* 주문 상품 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">주문 상품</h3>
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.quantity}개</p>
            </div>
            <p className="text-sm font-bold text-gray-900 self-center">
              {(item.price * item.quantity).toLocaleString()}원
            </p>
          </div>
        ))}
      </div>

      {/* 배송지 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">배송지</h3>
        <p className="text-sm text-gray-900 font-medium">{order.recipient}</p>
        <p className="text-sm text-gray-600 mt-0.5">{order.phone}</p>
        <p className="text-sm text-gray-600 mt-0.5">{order.shippingAddress}</p>
      </div>

      {/* 결제 금액 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">결제 금액</h3>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>상품 금액</span>
            <span>{order.totalPrice.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span>배송비</span>
            <span>{order.shippingFee === 0 ? '무료' : `${order.shippingFee.toLocaleString()}원`}</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
            <span>총 결제 금액</span>
            <span>{(order.totalPrice + order.shippingFee).toLocaleString()}원</span>
          </div>
        </div>
      </div>
    </div>
  );
}
