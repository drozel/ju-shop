from barcode import Code128
from barcode.writer import ImageWriter
from PIL import Image, ImageDraw

# Define parameters for the A4 sheet
page_width = 210  # mm
page_height = 297  # mm
barcode_width = 60  # mm
barcode_height = 40  # mm
columns = 3
rows = 10 

# Generate sequential numbers for barcodes
barcode_numbers = [f"{1000 + i}" for i in range(rows * columns)]

# Generate barcodes with Code128
barcodes = []
for number in barcode_numbers:
    barcode = Code128(number, writer=ImageWriter())
    barcode_image = barcode.render(writer_options={"module_width": 0.2, "module_height": 15, "quiet_zone": 1})
    barcodes.append(barcode_image)

# Create a full A4 image
a4_image = Image.new("RGB", (int(page_width * 10), int(page_height * 10)), "white")

# Define positions for barcodes
for i, barcode in enumerate(barcodes):
    x = (i % columns) * int(barcode_width * 10)
    y = (i // columns) * int(barcode_height * 10)
    # Draw a colored background rectangle for each barcode
    draw = ImageDraw.Draw(a4_image)
    color = (30 * (i % 8), 30 * ((i // 8) % 8), 100 + 10 * (i % 10))
    draw.rectangle([x, y, x + barcode_width * 10, y + barcode_height * 10], fill=color)
    # Paste the barcode
    barcode_resized = barcode.resize((int(barcode_width * 10), int(barcode_height * 10)))
    a4_image.paste(barcode_resized, (x, y))

# Save the image
a4_image.save("colored_barcodes_a4.png")
