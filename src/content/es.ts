/**
 * All user-facing copy (Spanish). Structure is locale-agnostic:
 * add content/en.ts exporting the same `SiteCopy` shape and register it in content/index.ts.
 *
 * SPOILER POLICY: premise, atmosphere, stakes, universe. Never the mystery or resolutions.
 */

export const es = {
  meta: {
    title: "HELA — Novela thriller noir de Andrés Rodríguez Escobar | Lago de Fuego",
    description:
      "HELA, novela thriller noir de Andrés Rodríguez Escobar. Una periodista asesinada, un detective atrapado y una ciudad sin nombre. Volumen I de Lago de Fuego. Finalista Top 5 del Concurso ITA.",
    ogTitle: "HELA — La ciudad no tiene nombre. Sus muertos, sí.",
    keywords: [
      "Andrés Rodríguez Escobar",
      "Hela",
      "Lago de Fuego",
      "novela thriller",
      "thriller noir",
      "novela de crimen",
      "novela de misterio",
      "thriller latinoamericano",
    ],
  },

  nav: {
    links: [
      { label: "Hela", href: "#hela" },
      { label: "El libro", href: "#libro" },
      { label: "Ediciones", href: "#ediciones" },
      { label: "Lago de Fuego", href: "#lago-de-fuego" },
      { label: "CrimeToks", href: "#crimetoks" },
      { label: "Autor", href: "#autor" },
    ],
    buy: "Comprar",
    menu: "Menú",
    close: "Cerrar",
    skip: "Saltar al contenido",
    mobileBuy: "COMPRAR HELA",
    orderBuy: "Pedir impreso",
  },

  hero: {
    kicker: "Martes 6 de abril · 03:08 · Ciudad Capital",
    kickerShort: "03:08 · Ciudad Capital",
    author: "Andrés Rodríguez E.",
    title: "HELA",
    series: "Lago de Fuego · Vol. 1",
    statement: "La ciudad no tiene nombre. Sus muertos, sí.",
    ctaPrimary: "Comprar HELA",
    ctaSecondary: "Leer el capítulo 1 gratis",
    proof: "Finalista Top 5 · Concurso ITA",
    proofMore: "· +2.000 novelas",
    scroll: "Desliza",
    coverAlt:
      "Portada de HELA, novela thriller noir de Andrés Rodríguez Escobar, volumen I de Lago de Fuego",
  },

  book: {
    label: "El libro",
    lines: [
      "A las 3:08 de la madrugada, una periodista de investigación muere de un disparo en un motel, en una capital sin nombre.",
      "Nadie ve al asesino. Y algunos de los que llegan primero no vienen a investigar.",
      "Un detective recibe el expediente. Cada respuesta que consigue lo deja más solo.",
      "Detrás del crimen hay algo más viejo que la corrupción: la forma en que el poder convierte el miedo en mito, y el mito en ley.",
    ],
    epigraph: {
      text: "…los cobardes, incrédulos, abominables, asesinos, inmorales, hechiceros, idólatras y todos los mentirosos tendrán su herencia en el lago que arde con fuego y azufre.",
      source: "Apocalipsis 21:8 — epígrafe de HELA",
    },
    myth:
      "En la mitología nórdica, Hela gobierna el reino de los muertos. Esta novela pregunta quién gobierna el de los vivos, y con qué miedo.",
    city: "La ciudad no tiene nombre porque podría ser cualquiera. Ese es el problema.",
    interlude: "03:08",
  },

  stats: {
    label: "Los números",
    pages: "Páginas",
    chapters: "Capítulos",
    rank: "Concurso ITA",
    entrants: "Novelas participantes",
    note: "Finalista Top 5 entre más de 2.000 novelas.",
  },

  editions: {
    label: "Ediciones",
    title: "Elige cómo entrar.",
    lead: "Dos formatos. La misma historia. El impreso lo pides aquí y llega a tu casa en Colombia. El Kindle lo compras en Amazon.",
    formatLegend: "Formato",
    retailerLegend: "Tienda",
    orderLegend: "Pedido directo",
    orderCta: "PEDIR HELA IMPRESA",
    orderNote: "Envío incluido a toda Colombia. Pagas con Nequi, PSE o tarjeta. Solo se despacha dentro de Colombia.",
    pricePending: "Precio por confirmar",
    isbnLabel: "ISBN",
    isbnPending: "Por asignar",
    placeholderNote: "Enlace provisional · se reemplaza al publicar",
    /** {retailer} is replaced with the retailer name */
    cta: "COMPRAR EN {retailer}",
    coverAlt: "Portada de HELA en formato",
  },

  chapter: {
    label: "Primer capítulo",
    title: "Lee el primer capítulo",
    teaserLine: "No sabe que la bala ya tiene su nombre.",
    teaserSource: "Primera línea de HELA",
    body: "Una madrugada. Un solo disparo. Todo lo demás viene después.",
    email: "Tu correo",
    firstName: "Tu nombre (opcional)",
    cta: "Leer gratis",
    sending: "Enviando…",
    fine: "Sin spam. Te escribo cuando hay algo que leer.",
    success: "Listo. Revisa tu correo.",
    successNote: "Esto es tan secreto que pudo irse a tu bandeja de spam.",
    successSimulated: "Registrado en modo de prueba: el envío real aún no está conectado.",
    error: "No pudimos registrar tu correo. Inténtalo de nuevo.",
    invalid: "Escribe un correo válido.",
  },

  lake: {
    label: "Lago de Fuego",
    title: "Lago de Fuego",
    stages: [
      { id: "one", text: "Cuatro historias." },
      { id: "two", text: "Un solo universo." },
      { id: "three", text: "Cuatro herejías." },
      { id: "four", text: "Todo está conectado." },
    ],
    stageNotes: {
      two: "Cuatro títulos. Cuatro letras cada uno. Una misma arquitectura.",
      three:
        "Herejías Cardinales es la idea que cruza los cuatro libros. Cada novela la examina desde un lugar distinto.",
      four: "Los libros no se leen como una serie. Se leen como un mapa.",
    },
    revealNote: "Lee la primera columna.",
    heresyLabel: "Herejía",
    undisclosed: "Por revelar",
    statusUpcoming: "Próximamente",
    statusUndisclosed: "En la sombra",
    volume: "Vol.",
    ariaSummary:
      "Lago de Fuego es una saga de cuatro novelas interconectadas: HELA, ERIC, LUCA y LENA. El concepto transversal es Herejías Cardinales. HELA trata del poder político y su relación con el mito y el miedo; ERIC, de la devoción religiosa como instrumento de control.",
  },

  eric: {
    label: "Siguiente volumen",
    title: "ERIC",
    series: "Lago de Fuego · Vol. II",
    status: "Próximamente",
    line: "Otro lugar. Otra fe. El mismo lago.",
    cta: "Avísame cuando salga",
    email: "Tu correo",
    send: "Avísame",
    ok: "Anotado. Serás de los primeros en saberlo.",
    coverAlt: "Portada de ERIC, volumen II de Lago de Fuego",
  },

  crime: {
    label: "CrimeToks",
    title: "El mismo instinto.",
    body: "En @andres_crimetoks cuento casos reales. La fascinación que sostiene el canal —el crimen, la investigación, la violencia, el poder que se esconde detrás— es la misma que atraviesa HELA. HELA es ficción.",
    statLabels: {
      followers: "Seguidores",
      totalViews: "Reproducciones",
      totalLikes: "Me gusta",
      videos: "Videos",
      topVideoViews: "Video más visto",
    },
    approx: "Cifras aproximadas del canal. Reproducciones acumuladas en 15 meses.",
    audienceTotal: "Más de 120.000 personas entre TikTok, Instagram y Facebook.",
    cta: "Ver @andres_crimetoks",
    dummy: "Miniatura provisional",
    alsoOn: "También en",
  },

  reviews: {
    label: "Lectores",
    title: "Los que ya entraron.",
    placeholderTag: "Cita real pendiente",
    placeholderQuote: "[CITA_DE_LECTOR]",
    placeholderAuthor: "[NOMBRE · FUENTE]",
    note: "Espacio reservado. Aquí solo irán citas reales de lectores y prensa.",
  },

  author: {
    label: "El autor",
    name: "Andrés Rodríguez Escobar",
    role: "Escritor y guionista",
    place: "Bogotá, Colombia",
    paragraphs: [
      "Escribe desde Bogotá. Su primera novela, Las mujeres mataron a los caballeros, nació en Facebook —se la considera una de las primeras escritas y publicadas en esa red— y salió en papel con un tiraje de 1.000 ejemplares que se agotó casi por completo.",
      "HELA fue finalista Top 5 del Concurso ITA, entre más de 2.000 novelas participantes. Es el primer volumen de Lago de Fuego, un universo de cuatro novelas.",
    ],
    portraitAlt: "Retrato en blanco y negro de Andrés Rodríguez Escobar, autor de HELA",
    facts: [
      ["Ciudad", "Bogotá, Colombia"],
      ["Oficio", "Escritor y guionista"],
      ["Libros", "Las mujeres mataron a los caballeros · HELA"],
      ["Distinción", "Top 5 · Concurso ITA"],
    ] as const,
  },

  newsletter: {
    label: "Umbral",
    title: "Entra al lago.",
    lead: "Recibe, antes que nadie:",
    items: [
      "Noticias de HELA",
      "Capítulos nuevos",
      "Los próximos volúmenes",
      "Novedades del autor",
      "Material exclusivo",
    ],
    email: "Tu correo",
    cta: "Quiero entrar",
    sending: "Entrando…",
    fine: "Un correo cuando hay algo que contar. Te sales cuando quieras.",
    success: "Ya estás dentro.",
    successNote: "Esto es tan secreto que pudo irse a tu bandeja de spam.",
    successSimulated: "Registrado en modo de prueba: el envío real aún no está conectado.",
    error: "No pudimos registrar tu correo. Inténtalo de nuevo.",
    invalid: "Escribe un correo válido.",
  },

  order: {
    footerLink: "Pedir el impreso",
    bar: { label: "HELA impresa", price: "$70.000 · envío incluido", only: "Solo Colombia", cta: "PEDIR" },
    title: "Pide HELA impresa",
    lead: "$70.000 COP con envío incluido. Solo enviamos dentro de Colombia.",
    legend: "Datos de entrega",
    fields: {
      name: "Nombre completo",
      email: "Correo",
      phone: "Celular",
      city: "Ciudad o municipio",
      dept: "Departamento",
      address: "Dirección",
      notes: "Barrio, torre, apto o indicaciones (opcional)",
    },
    consent: "Confirmo que la dirección está en Colombia y autorizo usar estos datos para gestionar el pago y el envío de mi pedido.",
    submit: "REGISTRAR Y PAGAR",
    sending: "Registrando…",
    close: "Cerrar",
    errors: {
      name: "Escribe tu nombre completo.",
      email: "Escribe un correo válido.",
      phone: "Escribe un celular colombiano de 10 dígitos.",
      city: "Escribe tu ciudad o municipio.",
      dept: "Escribe tu departamento.",
      address: "Escribe la dirección completa.",
      consent: "Debes aceptar para continuar.",
      server: "No pudimos registrar tu pedido. Intenta de nuevo en un momento o escríbenos a info@andresrodrigueze.com.",
    },
    done: {
      title: "Pedido registrado.",
      id: "Número de pedido",
      body: "Falta un paso: el pago. Se hace en la página segura de Bold, con Nequi, PSE o tarjeta débito o crédito. Tu pedido queda confirmado cuando se acredita el pago.",
      pay: "PAGAR $70.000",
      opening: "Abriendo el pago…",
      testMode: "Modo pruebas · no se cobra dinero real",
      payError: "No pudimos abrir el pago. Revisa tu conexión e inténtalo de nuevo; tu pedido ya quedó registrado.",
      after: "Cuando salga tu paquete te avisamos al correo. Si no ves nuestro mensaje, revisa la carpeta de spam.",
      keep: "Guarda tu número de pedido. Al pagar, usa el mismo nombre y correo que pusiste aquí.",
    },
  },

  strip: {
    title: "Ya conoces el lago.",
    line: "HELA · Impreso en Colombia · Kindle",
    cta: "Comprar HELA",
  },

  faq: {
    label: "Preguntas",
    title: "Antes de entrar.",
    items: [
      {
        q: "¿Necesito leer algo antes de HELA?",
        a: "No. HELA es el volumen I de Lago de Fuego y el punto de entrada.",
      },
      {
        q: "¿Es una saga? ¿Debo leerla completa?",
        a: "Lago de Fuego reúne cuatro novelas (HELA, ERIC, LUCA y LENA) unidas por una misma idea. Empieza por HELA.",
      },
      {
        q: "¿Para quién es?",
        a: "Para quien disfruta la novela negra y el thriller de investigación, en la línea de Javier Castillo, Harlan Coben o James Patterson, pero en una ciudad latinoamericana sin nombre.",
      },
      {
        q: "¿Tiene contenido fuerte?",
        a: "Sí. Es una novela negra para adultos: hay violencia, lenguaje crudo y temas duros.",
      },
      {
        q: "¿Cuánto dura?",
        a: "{pages} páginas repartidas en {chapters} capítulos.",
      },
      {
        q: "¿Dónde la compro y en qué formatos?",
        a: "El impreso cuesta $70.000 con envío incluido y lo pides aquí mismo, solo para Colombia. El Kindle lo compras en Amazon, desde cualquier país.",
      },
      {
        q: "¿Puedo leer un fragmento antes de comprar?",
        a: "Sí. Deja tu correo y te llega el primer capítulo, gratis.",
        link: { href: "#primer-capitulo", label: "Recibir el primer capítulo" },
      },
      {
        q: "¿HELA es una historia real?",
        a: "No. HELA es ficción. Los casos reales los cuento en @andres_crimetoks.",
      },
      {
        q: "¿Cuándo sale ERIC?",
        a: "ERIC es el volumen II y todavía no tiene fecha. Deja tu correo y te aviso.",
        link: { href: "#eric", label: "Avísame cuando salga" },
      },
    ],
    closing: "¿Listo?",
    closingCta: "Comprar HELA",
  },

  share: {
    label: "Compartir HELA",
    lead: "¿Conoces a alguien que debería leer HELA? Pásaselo.",
    cta: "Enviar por WhatsApp",
    text: "HELA — La ciudad no tiene nombre. Sus muertos, sí.",
    copied: "Enlace copiado",
  },

  privacy: {
    link: "Privacidad y aviso legal",
    consent: "Al enviar aceptas la política de privacidad.",
    title: "Privacidad y aviso legal",
    close: "Cerrar",
    contact: "Contacto",
    sections: [
      {
        h: "Responsable",
        p: "Andrés Rodríguez Escobar (Bogotá, Colombia) es el responsable del tratamiento de los datos que dejes en este sitio.",
      },
      {
        h: "Qué datos recogemos",
        p: "Tu correo electrónico y, si lo escribes, tu nombre. Si pides el libro impreso, también tu nombre completo, celular, ciudad, departamento y dirección de entrega. Además, datos de navegación agregados (qué secciones se visitan y desde qué red social se llega) para entender qué funciona.",
      },
      {
        h: "Para qué los usamos",
        p: "Para enviarte el primer capítulo y avisarte de HELA, de los próximos volúmenes de Lago de Fuego y de novedades del autor. Los datos de un pedido se usan solo para gestionar el pago, el envío y la atención de ese pedido. No vendemos ni cedemos tus datos; solo los comparte la transportadora que entrega el paquete.",
      },
      {
        h: "Tus derechos",
        p: "Conforme a la Ley 1581 de 2012 puedes conocer, actualizar, rectificar y suprimir tus datos, y revocar tu autorización, escribiendo al correo de contacto. También puedes darte de baja desde cualquier mensaje que recibas.",
      },
      {
        h: "Enlaces externos",
        p: "El Kindle se compra en Amazon, que tiene sus propias políticas. El pago del libro impreso lo procesa Bold en su propia página; este sitio no guarda datos de tarjetas ni de cuentas.",
      },
      {
        h: "Aviso legal",
        p: "HELA es una obra de ficción. Cualquier parecido con hechos o personas reales es coincidencia. Todos los derechos reservados: queda prohibida la reproducción total o parcial del texto y de las portadas sin autorización del autor.",
      },
    ],
  },

  thanks: {
    title: "Gracias.",
    order: "Número de pedido",
    body: "Si el pago fue aprobado, en unos minutos te llega un correo confirmando tu pedido. Puede tardar hasta unos 10 minutos. Si no lo ves, revisa la carpeta de spam.",
    problem: "Si tuviste algún problema con el pago, escríbenos y lo resolvemos.",
    cta: "Volver al inicio",
  },

  notFound: {
    title: "Esta página no existe.",
    line: "El lago sí.",
    cta: "Volver al inicio",
  },

  footer: {
    line: "Lago de Fuego",
    author: "Andrés Rodríguez E.",
    privacy: "Privacidad y aviso legal",
    rights: "Todos los derechos reservados.",
    legalPlaceholder: "[POLÍTICA_DE_PRIVACIDAD_URL]",
    fiction:
      "HELA es una obra de ficción. Cualquier parecido con hechos o personas reales es coincidencia.",
  },
};

export type SiteCopy = typeof es;
