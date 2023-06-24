import Jimp from "jimp";

export async function handleAvatar(path: string): Promise<void> {
  const image = await Jimp.read(path);
  await image
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE)
    .write(path);
}
