export default function CopyrightFooter() {
  return (
    <footer className="py-3 px-4 text-center text-xs text-gray-400 border-t border-jade-800/30 bg-black/80 backdrop-blur-sm">
      <p>
        &copy; {new Date().getFullYear()} L2JADE. Todos los derechos reservados.
        <span className="block sm:inline sm:ml-1">
          Desarrollado por{" "}
          <a
            href="http://www.gh0tstudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest-400 hover:underline"
          >
            www.gh0tstudio.com
          </a>
        </span>
      </p>
    </footer>
  )
}
