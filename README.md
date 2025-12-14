# Careless Whisper - WhatsApp Vulnerability PoC

A proof-of-concept tool for WhatsApp delivery receipt vulnerability research.

## Paper Reference

This implementation is based on the academic research paper:

**"Careless Whisper: Exploiting Silent Delivery Receipts to Monitor Users on Mobile Instant Messengers"**
- arXiv: [2411.11194](https://arxiv.org/abs/2411.11194)

## Disclaimer

⚠️ **WARNING**: This is a real PoC for authorized security research only.

- Unauthorized use is **ILLEGAL** and unethical
- This tool is intended for academic and authorized security research purposes only
- By using this tool, you accept full legal responsibility
- Ensure you have proper authorization before testing

## Usage

```bash
./run-server.sh
```

Then open http://localhost:3000 in your browser.

## Attack Types

1. **RTT Probing** - Detect device state through timing analysis
2. **Device Detection** - Multi-device tracking via delivery receipts
3. **Device Monitoring** - Online/offline status tracking
4. **Behavioral Fingerprinting** - Screen time and app usage analysis
5. **Resource Exhaustion** - Battery and data drain simulation

## Requirements

- Node.js 14+
- WhatsApp account for authentication
- Port 3000 available

## License

For authorized research use only.
