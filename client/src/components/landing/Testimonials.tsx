import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import testimonial1 from "@assets/generated_images/Professional_testimonial_portrait_woman_48fd3d49.png";
import testimonial2 from "@assets/generated_images/Professional_testimonial_portrait_man_dc4ba3a7.png";

const testimonials = [
  {
    quote: "LogiTrack transformed our delivery operations. Real-time tracking gives our customers peace of mind, and the M-Pesa integration makes payments seamless.",
    name: "Grace Kibet",
    role: "Operations Manager",
    company: "Eldoret Express",
    image: testimonial1,
  },
  {
    quote: "As a driver, the route optimization saves me hours every week. The app is intuitive, and collecting payments on delivery has never been easier.",
    name: "John Mwangi",
    role: "Delivery Driver",
    company: "Swift Logistics",
    image: testimonial2,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-muted/30" id="testimonials">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What our users say
          </h2>
          <p className="text-lg text-muted-foreground">
            Trusted by logistics professionals across Kenya
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8">
              <p className="text-lg text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
