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
          <p className="text-muted-foreground">Angaben gemäß § 5 TMG</p>
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
          </OxCard.Body>
        </OxCard>
        <OxCard>
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </OxCard.Body>
        </OxCard>
        <OxCard>
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>Datenschutzerklärung</h2>
            <p>
              1. Verantwortliche Stelle Verantwortlich für die Datenverarbeitung
              auf dieser Website ist: [Ihr Name / Name des Unternehmens] [Ihre
              Straße und Hausnummer] [Ihre Postleitzahl und Ort] [Ihre
              E-Mail-Adresse] [Ihre Telefonnummer (optional)]
            </p>
            <p>
              2. Erfassung von Zugriffsdaten (Server-Logfiles) Der Hoster dieser
              Website [Nennen Sie den Hoster, z.B. Host Europe GmbH] erhebt und
              speichert automatisch Informationen in sogenannten
              Server-Logfiles, die Ihr Browser automatisch an uns übermittelt.
              Diese sind: Browsertyp und Browserversion Verwendetes
              Betriebssystem Referrer URL (die zuvor besuchte Seite) Hostname
              des zugreifenden Rechners Uhrzeit der Serveranfrage IP-Adresse
              Diese Daten dienen der technischen Administration der Website, der
              Gewährleistung der Sicherheit unserer IT-Systeme und der
              Optimierung unseres Angebotes. Die Daten werden nicht mit anderen
              Datenquellen zusammengeführt. Rechtsgrundlage für die Verarbeitung
              ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem
              sicheren und stabilen Betrieb der Website). Die Logfiles werden
              nach [Nennen Sie eine Frist, z.B. maximal 7 Tage] automatisch
              gelöscht.
            </p>
            <p>
              3. Webanalyse mit Google Analytics Diese Website nutzt Google
              Analytics, einen Webanalysedienst der Google Ireland Limited
              ("Google"). Google Analytics verwendet sog. "Cookies",
              Textdateien, die auf Ihrem Computer gespeichert werden und die
              eine Analyse der Benutzung der Website durch Sie ermöglichen.
              Zweck: Analyse des Nutzerverhaltens zur Optimierung unseres
              Angebots. Rechtsgrundlage: Ihre Einwilligung gemäß Art. 6 Abs. 1
              lit. a DSGVO. IP-Anonymisierung: Wir haben auf dieser Website die
              Funktion IP-Anonymisierung (_anonymizeIp()) aktiviert. Dadurch
              wird Ihre IP-Adresse von Google innerhalb von Mitgliedstaaten der
              Europäischen Union oder in anderen Vertragsstaaten des Abkommens
              über den Europäischen Wirtschaftsraum vor der Übermittlung in die
              USA gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an
              einen Server von Google in den USA übertragen und dort gekürzt.
              Widerruf der Einwilligung: Sie können die Speicherung der Cookies
              durch eine entsprechende Einstellung Ihrer Browser-Software
              verhindern. Darüber hinaus können Sie die Erfassung der durch das
              Cookie erzeugten und auf Ihre Nutzung der Website bezogenen Daten
              (inkl. Ihrer IP-Adresse) an Google sowie die Verarbeitung dieser
              Daten durch Google verhindern, indem Sie das unter dem folgenden
              Link verfügbare Browser-Plugin herunterladen und installieren:
              [Link zum Browser-Add-on von Google Analytics]
            </p>
            <p>4. Umgang mit Fotos und persönlichen Daten beim Upload</p>
            <p>
              4.1. Hochladen von Fotos Wenn Sie Fotos auf unsere Website
              hochladen, verarbeiten wir die folgenden Daten: Das hochgeladene
              Foto selbst. Die Uhrzeit des Uploads. Die IP-Adresse des
              hochladenden Geräts (zur Missbrauchsprävention). Freiwillige
              persönliche Informationen: Sie haben die Möglichkeit, freiwillig
              persönliche Informationen (wie z.B. Ihren Namen, einen Titel oder
              eine Beschreibung) zu dem Foto hinzuzufügen. Diese Informationen
              werden zusammen mit dem Foto auf der Website veröffentlicht und
              sind für jedermann sichtbar. Rechtsgrundlage: Die Verarbeitung
              erfolgt auf Basis Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
              durch den Upload und das Hinzufügen der Informationen.
            </p>
            <p>
              4.2. Abtretung der Nutzungsrechte (Lizenz) und Widerruf Mit dem
              Hochladen des Fotos willigen Sie ein, dass Sie die Nutzungsrechte
              an dem Foto an den Webseiten-Betreiber abtreten. Dies ermöglicht
              uns die Veröffentlichung des Fotos auf unserer Website. Widerruf
              der Abtretung und Löschung: Sie können diese Einwilligung zur
              Veröffentlichung und die Abtretung der Nutzungsrechte jederzeit
              widerrufen. Senden Sie uns hierfür bitte eine E-Mail an die unter
              Ziffer 1 genannte E-Mail-Adresse. Der Widerruf ist nur wirksam,
              wenn das Foto klar identifiziert wird (z.B. durch Angabe des
              Dateinamens, des Titels oder der genauen URL, unter der es
              veröffentlicht ist). Nach erfolgreicher Identifikation und
              Widerruf werden wir das Foto und die damit verbundenen
              freiwilligen persönlichen Informationen von unserer Website
              entfernen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten
              Datenverarbeitung bleibt vom Widerruf unberührt.
            </p>
            <p>
              5. Betroffenenrechte Sie haben jederzeit das Recht: Auskunft über
              Ihre verarbeiteten personenbezogenen Daten zu verlangen (Art. 15
              DSGVO). Die Berichtigung unrichtiger oder die Vervollständigung
              unvollständiger bei uns gespeicherter Daten zu verlangen (Art. 16
              DSGVO). Die Löschung Ihrer bei uns gespeicherten personenbezogenen
              Daten zu verlangen (Art. 17 DSGVO), soweit nicht gesetzliche oder
              vertragliche Aufbewahrungsfristen entgegenstehen. Die
              Einschränkung der Verarbeitung zu verlangen (Art. 18 DSGVO). Das
              Recht auf Datenübertragbarkeit (Art. 20 DSGVO). Ihre einmal
              erteilte Einwilligung jederzeit uns gegenüber zu widerrufen (Art.
              7 Abs. 3 DSGVO). Widerspruch gegen die Verarbeitung Ihrer Daten
              einzulegen (Art. 21 DSGVO). Sich bei einer Aufsichtsbehörde zu
              beschweren (Art. 77 DSGVO), insbesondere in dem Mitgliedstaat
              Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des
              mutmaßlichen Verstoßes.
            </p>
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
