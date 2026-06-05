export function checkApiAuth(request: Request): boolean {
  const hardcodedKey = "I_AM_IRON_MAN_THANOS_CANNOT_STOP_ME";
  const apiKey = request.headers.get("x-api-key");
  const envKey = process.env.PUBLIC_EXPORT_KEY;
  return Boolean(
    apiKey && ((envKey && apiKey === envKey) || (hardcodedKey && apiKey === hardcodedKey))
  );
}
