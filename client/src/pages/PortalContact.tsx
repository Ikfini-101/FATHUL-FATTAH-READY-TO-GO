import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function PortalContact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactMutation = trpc.portal.contact.useMutation({
    onSuccess: () => {
      toast.success(t('portal.contact.form.success'));
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error: any) => {
      toast.error(error.message || t('portal.contact.form.error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-4xl font-bold">{t('portal.contact.title')}</h1>
            <LanguageSwitcher />
          </div>
          <a href="/portal" className="text-white/80 hover:text-white">
            {t('portal.contact.backToPortal')} ←
          </a>
        </div>
      </header>

      {/* Contact Form */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('portal.contact.heading')}</h2>
            <p className="text-lg text-gray-700">
              {t('portal.contact.description')}
            </p>
          </section>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                {t('portal.contact.form.name')}
              </label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full"
                placeholder={t('portal.contact.form.namePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                {t('portal.contact.form.email')}
              </label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full"
                placeholder={t('portal.contact.form.emailPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                {t('portal.contact.form.subject')}
              </label>
              <Input
                id="subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full"
                placeholder={t('portal.contact.form.subjectPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                {t('portal.contact.form.message')}
              </label>
              <Textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full min-h-[150px]"
                placeholder={t('portal.contact.form.messagePlaceholder')}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-yellow-700 hover:bg-yellow-800 text-white"
            >
              {t('portal.contact.form.submit')}
            </Button>
          </form>

          {/* Contact Info */}
          <section className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('portal.contact.info.address')}</h3>
              <p className="text-gray-700">
                {t('portal.contact.info.addressValue')}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('portal.contact.info.email')}</h3>
              <p className="text-gray-700">
                {t('portal.contact.info.emailValue')}
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>{t('portal.footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
