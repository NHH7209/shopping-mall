import Link from "next/link";

const skills = {
  Frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Axios"],
  Backend: ["NestJS", "TypeORM", "PostgreSQL", "JWT", "Passport", "Bcrypt", "class-validator", "Multer"],
  결제: ["Toss Payments"],
  Infra: ["Vercel", "Railway", "Cloudinary", "Git"],
};

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-16 mb-10">
          {/* 스킬 섹션 */}
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 링크 + 카피라이트 */}
        <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
          <div className="flex gap-6">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              서비스 이용약관
            </Link>
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              공지사항
            </Link>
          </div>
          <p className="text-xs text-gray-400">© 2026 ShoppingMall. Portfolio Project.</p>
        </div>
      </div>
    </footer>
  );
}
