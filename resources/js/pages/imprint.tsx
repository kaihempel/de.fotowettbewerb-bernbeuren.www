import { Head } from "@inertiajs/react";
import GlobalLayout from "@/layouts/global-layout";
import { OxCard } from "@noxickon/onyx";

interface ImprintProps {
  title: string;
}

export default function Imprint({ title }: ImprintProps) {
  return (
    <GlobalLayout>
      <Head title={title} />

      <div className="mx-auto max-w-4xl flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="text-muted-foreground">
            Angaben gemäß § 5 TMG
          </p>
        </div>

        {/* Content */}
        <OxCard>
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>Verantwortlich für den Inhalt</h2>
            <p>
              Fotowettbewerb Bernbeuren
              <br />
              Musterstraße 123
              <br />
              86975 Bernbeuren
            </p>

            <h2>Kontakt</h2>
            <p>
              E-Mail: info@fotowettbewerb-bernbeuren.de
              <br />
              Telefon: +49 (0) 8860 1234567
            </p>

            <h2>Haftungsausschluss</h2>

            <h3>Haftung für Inhalte</h3>
            <p>
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
              können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter
              sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich.
            </p>

            <h3>Haftung für Links</h3>
            <p>
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich.
            </p>

            <h2>Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>

            <h2>Datenschutz</h2>
            <p>
              Die Nutzung unserer Webseite ist in der Regel ohne Angabe
              personenbezogener Daten möglich. Soweit auf unseren Seiten
              personenbezogene Daten (beispielsweise Name, Anschrift oder
              eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich,
              stets auf freiwilliger Basis.
            </p>
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
