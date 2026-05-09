export default function PhoneFrame({ children }) {
  return (
    <>
      {/* Desktop: iPhone frame wrapper */}
      <div className="hidden md:flex min-h-screen items-center justify-center bg-black">
        <div
          className="relative overflow-hidden bg-white"
          style={{
            width: 393,
            height: 852,
            borderRadius: 54,
            boxShadow: '0 0 0 12px #1c1c1e, 0 0 0 14px #3a3a3c, 0 40px 80px rgba(0,0,0,0.8)',
          }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-black z-50"
            style={{ width: 126, height: 37, borderRadius: '0 0 20px 20px' }}
          />
          {children}
        </div>
      </div>

      {/* Mobile: full screen */}
      <div className="md:hidden w-full min-h-screen bg-white relative overflow-hidden">
        {children}
      </div>
    </>
  )
}
