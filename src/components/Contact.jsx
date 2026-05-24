import { Phone, Mail, Globe, MapPin, ArrowUpRight } from 'lucide-react'

const contacts = [
  {
    icon: Phone,
    title: 'Téléphone',
    value: '+33 07 58 58 02 67',
    href: 'tel:+330758580267',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'contact@partapex.com',
    href: 'mailto:contact@partapex.com',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Globe,
    title: 'Site Web',
    value: 'www.partapex.com',
    href: 'http://www.partapex.com',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: MapPin,
    title: 'Adresse',
    value: '121 Rue Manin, 75019 Paris',
    href: null,
    color: 'from-amber-500 to-orange-500',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-light to-primary"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="inline-block text-primary/70 text-sm font-semibold uppercase tracking-widest mb-3">Contact</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-6">
            Contactez-nous
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-primary to-primary-light mx-auto rounded-full mb-8"></div>
          <p className="text-text max-w-2xl mx-auto text-lg leading-relaxed">
            Prenez contact avec notre équipe pour discuter de vos besoins et démarrer votre transformation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contacts.map((c, i) => {
            const Wrapper = c.href ? 'a' : 'div'
            const wrapperProps = c.href ? { href: c.href, ...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}) } : {}

            return (
              <Wrapper
                key={i}
                {...wrapperProps}
                className="group bg-white border border-gray-100 rounded-3xl p-7 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${c.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <c.icon className="text-white" size={26} />
                </div>
                <h3 className="font-bold text-primary mb-2 text-lg">{c.title}</h3>
                <p className="text-text/70 text-sm leading-relaxed group-hover:text-primary transition-colors">
                  {c.value}
                </p>
                {c.href && (
                  <ArrowUpRight size={16} className="mx-auto mt-3 text-text/30 group-hover:text-primary transition-colors" />
                )}
              </Wrapper>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-primary to-primary-light rounded-3xl p-10 sm:p-14 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Prêt à transformer votre entreprise ?</h3>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">Contactez-nous dès aujourd'hui pour un premier échange gratuit et sans engagement.</p>
          <a
            href="mailto:contact@partapex.com"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
          >
            <Mail size={20} />
            Envoyer un email
          </a>
        </div>
      </div>
    </section>
  )
}
