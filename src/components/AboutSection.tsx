
import React from "react";
import { 
  GraduationCap, 
  Code,
  Book,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  return (
    <section id="about" className="py-10 bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="max-w-3xl mx-auto mb-16 text-left">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">About Me</h2>
              <div className="h-1 w-20 bg-blue-600 mb-6"></div>
              <p className="text-lg text-gray-600">
                I'm a final-year Computer Science student at Botswana International University of Science and Technology with a passion for software development and problem-solving.
              </p>
            </div>
            <Card className="overflow-hidden border border-slate-200">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">My Goal</h3>
                <p className="text-gray-600 mb-6">
                  I'm driven by the desire to build software that makes a difference. Currently focusing on web development and AI applications, I aim to blend technical excellence with great user experiences.
                </p>
                <p className="text-gray-600 mb-6">
                  My academic interests include web development, artificial intelligence, machine learning, and software architecture. I'm constantly learning and expanding my skill set through projects, coursework, and self-study.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="#skills">
                    View My Skills <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Education & Journey</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <GraduationCap size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">BSc in Computer Science and Software Engineering</h4>
                  <p className="text-gray-600">Botswana International University of Science and Technology (2022 - Present)</p>
                  <p className="mt-2 text-gray-600">Specializing in Software Engineering</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Code size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">Full-Stack Development Intern</h4>
                  <p className="text-gray-600">CodVeda Technologies (Aug 2025 - Present)</p>
                  <p className="mt-2 text-gray-600">Gaining hands-on experience in full-stack development, working with modern web technologies to build and deploy scalable applications.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Book size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">Information Management Attache</h4>
                  <p className="text-gray-600">Debswana Diamond Company (Jun 2025 - Jul 2025)</p>
                  <p className="mt-2 text-gray-600">Completed a 2-month internship, contributing to internal IT projects and gaining valuable industry experience.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Code size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">Open Source Contributor</h4>
                  <p className="text-gray-600">Various Projects (2022 - Present)</p>
                  <p className="mt-2 text-gray-600">Contributing to open-source projects in my spare time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
