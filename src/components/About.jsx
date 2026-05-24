import { Target, Users, TrendingUp, Award } from 'lucide-react'

export default function About() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/3 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <span className="inline-block text-primary/70 text-sm font-semibold uppercase tracking-widest mb-3">Qui sommes-nous</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-6">
            À propos de PARTAPEX
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-primary to-primary-light mx-auto rounded-full mb-8"></div>
          <p className="text-text max-w-3xl mx-auto text-lg leading-relaxed">
            PARTAPEX CONSULTING accompagne les PME, TPE et Start-Up dans leur transformation
            et leur croissance. Notre expertise couvre la gestion administrative, les ressources
            humaines, la transformation numérique et le conseil stratégique.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { value: '50+', label: 'Entreprises' },
            { value: '6', label: 'Ans d\'expérience' },
            { value: '98%', label: 'Satisfaction' },
            { value: '200+', label: 'Projets livrés' },
          ].map((stat, i) => (
            <div key={i} className="text-center py-6 px-4 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent">
              <p className="text-3xl sm:text-4xl font-extrabold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-text/60 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {[
            { icon: Target, title: 'Notre Mission', desc: 'Simplifier la gestion de votre entreprise pour vous permettre de vous concentrer sur votre cœur de métier et accélérer votre développement.' },
            { icon: Users, title: 'Notre Équipe', desc: 'Une équipe de consultants expérimentés, passionnés par l\'accompagnement des entreprises dans leur croissance et leur transformation.' },
            { icon: TrendingUp, title: 'Nos Valeurs', desc: 'Excellence, proximité et engagement. Nous construisons des relations durables basées sur la confiance et les résultats concrets.' },
          ].map((item, i) => (
            <div key={i} className="group bg-white border border-gray-100 rounded-3xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-18 h-18 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="text-primary" size={34} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
              <p className="text-text/80 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
