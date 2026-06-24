export default function Layout({ children }) {
  return (
    <section className="py-6 md:py-10">
      <main>{children}</main>
    </section>
  );
}
