import Link from 'next/link';

// TODO: orders API 연동 후 실제 데이터로 교체
const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    date: '2025-03-15',
    status: '배송완료',
    items: [{ name: '상품 예시 A', quantity: 1, price: 35000 }],
    totalPrice: 35000,
  },
  {
    id: 'ORD-002',
    date: '2025-03-10',
    status: '배송중',
    items: [
      { name: '상품 예시 B', quantity: 2, price: 12000 },
      { name: '상품 예시 C', quantity: 1, price: 8000 },
    ],
    totalPrice: 32000,
  },
];

const statusColor: Record<string, string> = {
  주문완료: 'bg-blue-100 text-blue-700',
  배송중: 'bg-yellow-100 text-yellow-700',
  배송완료: 'bg-green-100 text-green-700',
  취소됨: 'bg-gray-100 text-gray-500',
};

export default function OrdersPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">주문 내역</h2>

      {MOCK_ORDERS.length === 0 ? (
        <p className="text-gray-400 text-sm">주문 내역이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {MOCK_ORDERS.map((order) => (
            <Link
              key={order.id}
              href={`/mypage/orders/${order.id}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
            >
              {/* 주문 헤더 */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">{order.date}</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">
                    주문번호: {order.id}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[order.status]}`}>
                  {order.status}
                </span>
              </div>

              {/* 주문 상품 목록 */}
              <div className="border-t border-gray-100 pt-3">
                {order.items.map((item, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    {item.name} × {item.quantity}
                  </p>
                ))}
              </div>

              {/* 총 금액 */}
              <p className="text-right text-sm font-bold text-gray-900 mt-3">
                {order.totalPrice.toLocaleString()}원
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
