import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, Calendar, ChevronRight } from 'lucide-react';
import { TIMELINE_DATA } from '../data/mockData';

export const Timeline: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState(TIMELINE_DATA[3].id); // default highlight April-Mei

  return (
    <section id="timeline" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f3f4f5] text-[#1b4332] text-xs font-bold uppercase tracking-wider mb-4">
            <Clock className="w-3.5 h-3.5" />
            JOURNEY TIMELINE
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#012d1d] tracking-tight mb-4">
            Alur Perjalanan Pengabdian
          </h2>
          <p className="text-[#414844] text-base leading-relaxed">
            Dari perencanaan strategis di kampus hingga senyum perpisahan warga di desa. Setiap tahap dirancang terstruktur dan berkelanjutan.
          </p>
        </div>

        {/* Timeline Desktop & Mobile Grid */}
        <div className="relative">
          {/* Vertical Line for Desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#e7e8e9] -translate-x-1/2 rounded-full" />

          <div className="space-y-8 lg:space-y-12">
            {TIMELINE_DATA.map((step, index) => {
              const isEven = index % 2 === 0;
              const isActive = activeStepId === step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className="relative cursor-pointer group"
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-center`}
                  >
                    {/* Left Column (Desktop) */}
                    <div
                      className={`lg:col-span-5 ${
                        isEven ? 'lg:text-right' : 'lg:order-last lg:text-left'
                      }`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${
                          isActive
                            ? 'bg-[#012d1d] text-white border-[#012d1d] memoir-shadow-lg scale-[1.02]'
                            : 'bg-[#f8f9fa] text-[#191c1d] border-gray-100 hover:bg-white hover:border-[#a5d0b9]'
                        }`}
                      >
                        {/* Month Badge */}
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                            isActive
                              ? 'bg-[#c1ecd4] text-[#002114]'
                              : 'bg-white text-[#1b4332] border border-gray-200'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          {step.monthYear}
                        </div>

                        {/* Step Title */}
                        <h3
                          className={`font-heading font-bold text-xl sm:text-2xl mb-3 ${
                            isActive ? 'text-white' : 'text-[#012d1d]'
                          }`}
                        >
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p
                          className={`text-sm leading-relaxed mb-4 ${
                            isActive ? 'text-white/80' : 'text-[#414844]'
                          }`}
                        >
                          {step.description}
                        </p>

                        {/* Bullet Highlights */}
                        <div
                          className={`pt-4 border-t flex flex-wrap gap-2 ${
                            isActive ? 'border-white/20' : 'border-gray-200/60'
                          } ${isEven ? 'lg:justify-end' : 'lg:justify-start'}`}
                        >
                          {step.highlights.map((item, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 ${
                                isActive
                                  ? 'bg-white/10 text-[#c1ecd4]'
                                  : 'bg-white text-[#1b4332] border border-gray-100'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3 shrink-0" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Timeline Center Node Pin (Desktop) */}
                    <div className="hidden lg:flex lg:col-span-2 justify-center items-center z-10">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold font-heading text-sm transition-all duration-300 ${
                          isActive
                            ? 'bg-[#1b4332] text-[#c1ecd4] ring-4 ring-[#c1ecd4] shadow-lg scale-110'
                            : 'bg-white text-[#414844] border-2 border-gray-200 group-hover:border-[#1b4332]'
                        }`}
                      >
                        0{index + 1}
                      </div>
                    </div>

                    {/* Empty Space for Grid Alignment */}
                    <div
                      className={`hidden lg:block lg:col-span-5 ${
                        isEven ? 'lg:order-last' : ''
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
