import logo from "/Imagenes/logo-decoronce-op2.png";

export const Watermark = () => {
  return (
    <>
      {/* 1. Marca central (sutil) */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999] opacity-5 hover:opacity-20 transition-opacity duration-300">
        <img
          src={logo}
          alt=""
          className="w-1/3 max-w-[100px] grayscale contrast-75 rotate-[-8deg]"
        />
      </div>

      <div className="flex justify-center pointer-events-none z-[9999] will-change-transform">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Marca registrada"
            className="w-12 h-auto"
            draggable="false"
          />
          <span className="text-xs font-medium text-gray-500/80 whitespace-nowrap select-none">
            ©{new Date().getFullYear()}
          </span>
        </div>
      </div>

      {/* 3. Marca superior izquierda (mínima) */}
      <div className="fixed top-3 left-6 pointer-events-none z-[9999] opacity-15">
        <img src={logo} alt="" className="w-10  rotate-[-12deg]" />
      </div>
    </>
  );
};
