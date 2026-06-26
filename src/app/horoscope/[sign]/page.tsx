import { redirect } from "next/navigation";

const VALID_SIGNS = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];

export default function SignPage({ params }: { params: { sign: string } }) {
  const sign = params.sign?.toLowerCase();
  if (VALID_SIGNS.includes(sign)) {
    redirect(`/horoscope?sign=${sign}`);
  }
  redirect("/horoscope");
}
