import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { OButton } from '@/components/omel/Button';

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
    console.log('Form submitted:', formData);
    toast.success('تم إرسال الرسالة');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <section id="contact" className="section bg-secondary py-10 px-5">
      <div className="container-custom">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="title-medium mb-3">تواصل معنا</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نحن هنا لمساعدتك. تواصل معنا لأي استفسار أو لطلب عرض توضيحي خاص بشركتك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  الاسم
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-white border-border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  البريد الإلكتروني
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white border-border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-1">
                  الشركة
                </label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="bg-white border-border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  الرسالة
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="bg-white border-border h-28 rounded-md"
                />
              </div>
              <OButton type="submit" className="w-full rounded-md">
                إرسال
              </OButton>
            </form>
          </div>

          <div className="animate-fade-in space-y-6" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white p-5 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4">معلومات التواصل</h3>

              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary ml-3 mt-1" />
                  <div>
                    <h4 className="font-medium">البريد الإلكتروني</h4>
                    <p className="text-muted-foreground">info@sahara-crm.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary ml-3 mt-1" />
                  <div>
                    <h4 className="font-medium">الهاتف</h4>
                    <p className="text-muted-foreground">+966 12 345 6789</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary ml-3 mt-1" />
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
