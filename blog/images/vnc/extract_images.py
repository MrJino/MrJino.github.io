#!/usr/bin/env python3
"""
PDF에서 이미지를 추출하는 스크립트
사용법: python3 extract_images.py
"""

import fitz  # PyMuPDF
import os

def extract_images_from_pdf():
    # PDF 파일 경로
    pdf_path = '../../pdf/NativeTeam-네이티브팀 원격제어기능 VNC-201125-052818.pdf'
    output_dir = '.'

    if not os.path.exists(pdf_path):
        print(f"Error: PDF file not found at {pdf_path}")
        return

    print(f"Opening PDF: {pdf_path}")
    doc = fitz.open(pdf_path)

    print(f"Total pages: {len(doc)}")

    # 각 페이지를 이미지로 변환
    for page_num in range(len(doc)):
        page = doc[page_num]

        # 고해상도로 렌더링 (2배 확대)
        mat = fitz.Matrix(2.0, 2.0)
        pix = page.get_pixmap(matrix=mat)

        # 파일명 생성
        output_path = f'page_{page_num + 1:02d}.png'

        # 이미지 저장
        pix.save(output_path)
        print(f"Saved: {output_path} ({pix.width}x{pix.height})")

    doc.close()
    print(f"\nTotal {len(doc)} images extracted successfully!")

    # 이미지 파일명 매핑 제안
    print("\n=== Recommended file renaming ===")
    print("page_01.png -> ultravnc-install.png")
    print("page_02.png -> vnc-direct-diagram.png")
    print("page_02.png (crop) -> vnc-server-properties.png")
    print("page_02.png (crop) -> vnc-viewer-connect.png")
    print("page_03.png (crop) -> vnc-connected.png")
    print("page_03.png (crop) -> vnc-repeater-diagram.png")
    print("page_05.png (crop) -> vnc-server-add-client.png")
    print("page_06.png (crop) -> vnc-viewer-repeater.png")
    print("page_09.png (crop) -> novnc-setup.png")
    print("page_11.png (crop) -> novnc-connected.png")

if __name__ == "__main__":
    try:
        extract_images_from_pdf()
    except ImportError:
        print("\n❌ PyMuPDF is not installed!")
        print("\nPlease install it using:")
        print("  python3 -m venv venv")
        print("  source venv/bin/activate")
        print("  pip install PyMuPDF")
        print("  python3 extract_images.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")
