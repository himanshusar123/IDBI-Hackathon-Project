import os
import win32com.client

def convert_pptx_to_pdf():
    pptx_path = r"C:\Users\Himanshu Sardana\.gemini\antigravity-ide\scratch\digital-wealth-avatar\Aura_Wealth_Advisor_Presentation.pptx"
    pdf_path = r"C:\Users\Himanshu Sardana\.gemini\antigravity-ide\scratch\digital-wealth-avatar\Aura_Wealth_Advisor_Presentation.pdf"
    
    if not os.path.exists(pptx_path):
        print(f"Error: PPTX file not found at {pptx_path}")
        return

    print("Launching PowerPoint COM interface to convert slide deck to PDF...")
    try:
        powerpoint = win32com.client.Dispatch("Powerpoint.Application")
        # Open presentation in windowless mode if possible
        presentation = powerpoint.Presentations.Open(pptx_path, WithWindow=False)
        # 32 represents ppSaveAsPDF
        presentation.SaveAs(pdf_path, 32)
        presentation.Close()
        powerpoint.Quit()
        print(f"Success! Presentation saved to PDF at:\n{pdf_path}")
    except Exception as e:
        print(f"Failed to convert PPTX to PDF using COM: {e}")
        print("Please open the PPTX file manually in PowerPoint and export/save it as PDF.")

if __name__ == "__main__":
    convert_pptx_to_pdf()
