import { Head } from "@inertiajs/react";
import GlobalLayout from "@/layouts/global-layout";
import { OxCard } from "@noxickon/onyx";
import { Target, Calendar, Award, Info } from "lucide-react";

interface ProjectProps {
  title: string;
}

export default function Project({ title }: ProjectProps) {
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
            Alles über unseren Fotowettbewerb
          </p>
        </div>

        {/* Content Cards */}
        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Info className="size-5 text-primary" />
                <span className="text-xl font-semibold">
                  Was ist der Fotowettbewerb Bernbeuren?
                </span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-inert max-w-none">
            <p>
              Der Fotowettbewerb Bernbeuren ist ein jährlich stattfindender
              Wettbewerb für Fotografie-Begeisterte aus der Region und darüber
              hinaus. Ob Hobbyfotograf oder Profi - bei uns ist jeder
              willkommen, seine besten Aufnahmen einzureichen und mit anderen zu
              teilen.
            </p>
            <p>
              Die Plattform ermöglicht es den Teilnehmern, ihre Fotos
              hochzuladen, von der Jury bewerten zu lassen und am Ende durch
              öffentliches Voting die beliebtesten Bilder zu küren.
            </p>
          </OxCard.Body>
        </OxCard>

        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Target className="size-5 text-primary" />
                <span className="text-xl font-semibold">Projektziele</span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <ul>
              <li>Förderung der Fotografie-Kultur in der Region Bernbeuren</li>
              <li>
                Schaffung einer Plattform für Austausch und Vernetzung von
                Fotografen
              </li>
              <li>
                Präsentation der vielfältigen fotografischen Talente unserer
                Gemeinschaft
              </li>
              <li>
                Organisation einer öffentlichen Ausstellung der besten Werke
              </li>
              <li>Auszeichnung herausragender fotografischer Leistungen</li>
            </ul>
          </OxCard.Body>
        </OxCard>

        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                <span className="text-xl font-semibold">
                  Ablauf des Wettbewerbs
                </span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <ol>
              <li>
                <strong>Einreichungsphase</strong> - Fotografen können ihre
                besten Aufnahmen über die Plattform hochladen
              </li>
              <li>
                <strong>Jury-Bewertung</strong> - Eine fachkundige Jury sichtet
                und bewertet alle eingereichten Fotos
              </li>
              <li>
                <strong>Öffentliche Galerie</strong> - Zugelassene Fotos werden
                in der öffentlichen Galerie präsentiert
              </li>
              <li>
                <strong>Publikumsvoting</strong> - Besucher können für ihre
                Lieblingsbilder abstimmen
              </li>
              <li>
                <strong>Ausstellung & Preisverleihung</strong> - Die besten
                Fotos werden ausgestellt und die Gewinner geehrt
              </li>
            </ol>
          </OxCard.Body>
        </OxCard>

        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Award className="size-5 text-primary" />
                <span className="text-xl font-semibold">
                  Kategorien & Preise
                </span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Der Wettbewerb umfasst verschiedene Kategorien, um der Vielfalt
              fotografischer Genres gerecht zu werden:
            </p>
            <ul>
              <li>Landschaft & Natur</li>
              <li>Porträt & Menschen</li>
              <li>Architektur & Stadt</li>
              <li>Kreativ & Abstrakt</li>
            </ul>
            <p>
              Für die Gewinner jeder Kategorie sowie den Gesamtsieger warten
              attraktive Preise und die Möglichkeit, ihre Werke in einer
              öffentlichen Ausstellung zu präsentieren.
            </p>
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
