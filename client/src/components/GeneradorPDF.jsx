import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import ConversorNumeros from './ConversorNumeros';

const DocumentoPDF = async (nro, name, cash, day, month, year, codigo_alumno, curso_alumno, anioseguro) => {
  // Crear un nuevo documento PDF
  const pdfDoc = await PDFDocument.create();

  // Añadir una página al documento
  const page = pdfDoc.addPage([612, 792]); // Tamaño Letter

  // Definir colores
  const red = rgb(1, 0.1137, 0.05098);
  const blue = rgb(0.043, 0.2549, 0.6118);

  // Cargar fuentes
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Añadir imagen de fondo (puedes usar urls o rutas absolutas)
  const backgroundImageBytes = await fetch('/path/to/background2.jpg').then(res => res.arrayBuffer());
  const backgroundImage = await pdfDoc.embedJpg(backgroundImageBytes);
  const backgroundImageDims = backgroundImage.scale(1);

  page.drawImage(backgroundImage, {
    x: 0,
    y: page.getHeight() - backgroundImageDims.height,
    width: backgroundImageDims.width,
    height: backgroundImageDims.height,
    opacity: 0.8,
  });

  // Añadir logo superior
  const logoImageBytes = await fetch('/path/to/logoReducido.jpg').then(res => res.arrayBuffer());
  const logoImage = await pdfDoc.embedJpg(logoImageBytes);
  const logoImageDims = logoImage.scale(0.5);

  page.drawImage(logoImage, {
    x: 0,
    y: page.getHeight() - logoImageDims.height,
    width: logoImageDims.width,
    height: logoImageDims.height,
  });

  // Añadir el texto
  const textSize = 22;
  page.drawText('COMPROBANTE', {
    x: page.getWidth() - 200,
    y: page.getHeight() - 50,
    size: textSize,
    font: font,
    color: blue,
  });

  page.drawText('DE PAGO', {
    x: page.getWidth() - 200,
    y: page.getHeight() - 80,
    size: textSize,
    font: font,
    color: blue,
  });

  page.drawText(`Nro. ${nro}`, {
    x: 50,
    y: page.getHeight() - 100,
    size: 15,
    font: font,
    color: red,
  });

  const content = [
    { text: `Fecha: ${day} de ${month} del ${year}`, x: 50, y: page.getHeight() - 150, color: blue },
    { text: `He recibido del Alumno(a): ${name.toUpperCase()}`, x: 50, y: page.getHeight() - 180, color: blue },
    { text: `La suma de: ${ConversorNumeros.convertir(cash)}`, x: 50, y: page.getHeight() - 210, color: blue },
    { text: `Por concepto de: ASISTENCIA MEDICA DE EMERGENCIA`, x: 50, y: page.getHeight() - 240, color: blue },
    { text: `Gestion: ${anioseguro}`, x: 50, y: page.getHeight() - 270, color: blue },
    { text: `Codigo del alumno: ${codigo_alumno.toUpperCase()}`, x: 50, y: page.getHeight() - 300, color: blue },
    { text: `Curso: ${curso_alumno.toUpperCase()}`, x: 50, y: page.getHeight() - 330, color: blue },
  ];

  content.forEach(({ text, x, y, color }) => {
    page.drawText(text, { x, y, size: 15, font: font, color });
  });

  // Guardar el PDF en un archivo
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, `${name.toUpperCase()}.pdf`);
};

export default DocumentoPDF;
