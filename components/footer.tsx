export default function Footer() {
  return (
    <footer className="border-t border-jade-800/30 bg-black/80 backdrop-blur-sm py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2024 Comunidad Jade. Todos los derechos reservados.</p>
          <div className="mt-4 md:mt-0">
            <p className="text-xs text-gray-500">
              Al usar nuestro sitio web, aceptas el uso de cookies para proponer la mejor experiencia de usuario y
              recopilar estadísticas útiles. Para obtener más información sobre las cookies y editar tu configuración,
              consulta nuestra página de cookies.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
