import logo from "/Imagenes/estilo-cortina2.jpg";

export const Watermark = () => {
  return (
    <>
      {/* 1. Marca central (sutil) */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999] opacity-10 hover:opacity-100 transition-opacity duration-300">
        <img
          src={logo}
          alt=""
          className="w-1/3 max-w-[100px]  contrast-75 rotate-[-8deg]"
        />
      </div>

      <div className="flex justify-center pointer-events-none z-[9999] will-change-transform">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Marca registrada"
            className="w-20 h-25"
            draggable="false"
          />
          <span className="text-xs font-medium text-gray-500/80 whitespace-nowrap select-none">
            ©{new Date().getFullYear()}
          </span>
        </div>
      </div>

      {/* 3. Marca superior izquierda (mínima) */}
      <div className="fixed top-3 left-6 pointer-events-none z-[9999] opacity-15">
        <img src={logo} alt="" className="w-20  rotate-[-12deg]" />
      </div>
    </>
  );
};
