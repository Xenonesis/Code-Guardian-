import React from 'react';
import { Crown, User, Code, Shield, ExternalLink, Github, Linkedin, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TeamMember {
  name: string;
  role: string;
  icon: React.ReactNode;
  description: string;
  expertise: string[];
  color: string;
  avatar: string;
}

export const TeamShowcaseSection: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Aditya Kumar Tiwari",
      role: "Team Leader & Security Expert",
      icon: <Crown className="w-5 h-5" />,
      description: "Cybersecurity expert and lead developer specializing in security architecture and vulnerability analysis",
      expertise: ["Team Leadership", "Cybersecurity", "Penetration Testing", "Security Architecture", "Vulnerability Assessment", "Project Management"],
      color: "from-purple-500 to-indigo-500",
      avatar: "AKT"
    },
    {
      name: "Aayush Tonk",
      role: "Full Stack Developer",
      icon: <Code className="w-5 h-5" />,
      description: "Experienced full-stack developer with expertise in modern web technologies and scalable application development",
      expertise: ["Full Stack Development", "React & Node.js", "Database Design", "API Development", "Cloud Architecture", "DevOps"],
      color: "from-blue-500 to-cyan-500",
      avatar: "ME"
    },
    {
      name: "Prachi Upadhyay",
      role: "Security Analyst",
      icon: <Shield className="w-5 h-5" />,
      description: "Security specialist focused on threat analysis, vulnerability assessment, and security protocol implementation",
      expertise: ["Security Analysis", "Threat Detection", "Risk Assessment", "Compliance", "Security Protocols", "Incident Response"],
      color: "from-red-500 to-pink-500",
      avatar: "SMH"
    },
  ];

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-900/50 dark:to-purple-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Our Team
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-purple-700 to-blue-700 dark:from-white dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
                Meet the Experts
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              A passionate team of security experts and developers dedicated to making code security accessible to everyone
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="group hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    {/* Avatar */}
                    <div className={`relative p-4 rounded-2xl bg-gradient-to-r ${member.color} text-white text-xl font-bold min-w-[4rem] h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {member.avatar}
                      <div className="absolute -top-1 -right-1 p-1 bg-white dark:bg-slate-800 rounded-full">
                        {member.icon}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {member.name}
                      </h3>
                      <Badge className={`bg-gradient-to-r ${member.color} text-white border-0 mb-2`}>
                        {member.role}
                      </Badge>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  </div>

                  {/* Expertise */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant="outline"
                          className="text-xs bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Connect:</span>
                    <div className="flex gap-2">
                      {[Github, Linkedin, Mail].map((Icon, iconIndex) => (
                        <button
                          key={iconIndex}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 group/btn"
                        >
                          <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover/btn:text-slate-900 dark:group-hover/btn:text-white" />
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Team CTA */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Powered By Team Blitz ⚡
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                We're part of Team Blitz, a collective of passionate developers and security experts 
                working on cutting-edge projects. Visit our team website to learn more about our 
                projects and initiatives.
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.open('https://teamblitz.netlify.app/', '_blank')}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Visit Team Blitz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};