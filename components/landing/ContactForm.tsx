import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be connected to a real form submission API in production
    console.log('Form submitted:', formData);
    // TODO: Add API call here

    toast.success('تم إرسال الرسالة');
    // Reset form
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <section id="contact" className="section bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="title-medium mb-4">تواصل معنا</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نحن هنا لمساعدتك. تواصل معنا لأي استفسار أو لطلب عرض توضيحي خاص بشركتك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  الاسم
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-white border-border"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  البريد الإلكتروني
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white border-border"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2">
                  الشركة
                </label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="bg-white border-border"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  الرسالة
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="bg-white border-border h-32"
                />
              </div>
              <Button type="submit" className="w-full btn-primary">
                إرسال
              </Button>
            </form>
          </div>

          <div className="animate-fade-in space-y-8" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-6">معلومات التواصل</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary ml-4 mt-1" />
                  <div>
                    <h4 className="font-medium">البريد الإلكتروني</h4>
                    <p className="text-muted-foreground">info@sahara-crm.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary ml-4 mt-1" />
                  <div>
                    <h4 className="font-medium">الهاتف</h4>
                    <p className="text-muted-foreground">+966 12 345 6789</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary ml-4 mt-1" />
                  <div>
                    <h4 className="font-medium">العنوان</h4>
                    <p className="text-muted-foreground">
                      برج المملكة، الطابق 25
                      <br />
                      طريق الملك فهد، الرياض
                      <br />
                      المملكة العربية السعودية
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="aspect-video bg-white rounded-lg border border-border flex items-center justify-center">
              <span className="text-muted-foreground">خريطة الموقع</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
