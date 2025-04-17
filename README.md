# project230225

## Cấu trúc thư mục dự án

Dưới đây là cấu trúc thư mục của dự án:

```
/project
├── /frontend
│   ├── .env                  # File chứa các biến môi trường cho frontend
│   ├── public               # Thư mục chứa các tài nguyên công khai
│   ├── src                  # Thư mục mã nguồn chính của frontend
│   │   ├── assets           # Tài nguyên tĩnh (ảnh, font, v.v.)
│   │   ├── auth             # Xử lý xác thực (login, logout, v.v.)
│   │   ├── components       # Các thành phần giao diện (layout, sidebar, topbar, ...)
│   │   ├── configs          # Cấu hình ứng dụng
│   │   ├── constants        # Các hằng số dùng trong dự án
│   │   ├── locales          # Quản lý ngôn ngữ (language)
│   │   ├── mock             # Dữ liệu giả lập để gọi API
│   │   ├── services         # Các dịch vụ gọi API
│   │   ├── views            # Giao diện web
│   │   │   ├── auth         # Giao diện xác thực
│   │   │   ├── concepts     # Module cụ thể
│   │   │   ├── dashboards   # Giao diện dashboard
├── /backend
│   ├── .env                 # File chứa các biến môi trường cho backend
│   ├── app                  # Lưu trữ các model của ứng dụng
│   ├── config               # Cấu hình database và môi trường cho API
│   ├── img                  # Lưu trữ ảnh hồ sơ người dùng
│   ├── routes              # Định nghĩa các tuyến đường API
│   ├── services            # Logic xử lý cho API
│   ├── server.js           # File khởi chạy server
```
#### Giao diện Frontend (FE)

📁 **Thư mục:** `frontend/src/views`

- 🔐 **Trang đăng nhập:** `auth/SignIn/SignIn.tsx`  
- 📝 **Trang đăng ký:** `auth/SignUp/SignUp.tsx`  
- 📊 **Trang thống kê:** `dashboards/EcommerceDashboard/index.ts`  
- 📁 **Trang quản lý file:** `concepts/files/FileManager/index.ts`  
- 🤖 **Trang chat AI:** `concepts/ai/Chat/components/ChatView.tsx`  
- 👥 **Trang danh sách khách hàng:** `concepts/customers/CustomerList/index.tsx`  
- 📦 **Trang tạo gói:** `concepts/orders/OrderCreate/index.ts`  
- 💰 **Trang gói:** `concepts/accounts/Pricing/Pricing.tsx`  
- ⚙️ **Trang cài đặt tài khoản:** `concepts/accounts/Settings/index.ts`
#### Cơ chế xác nhận thanh toán PayOS
![image](https://github.com/user-attachments/assets/4c56df42-6ea4-481b-b337-e0d2ee45203c)

## Hướng dẫn chạy localhost và deploy

### Chạy trên localhost

#### Frontend (FE):
- Di chuyển vào thư mục frontend và chạy:
  ```
  /frontend> npm run dev
  ```

#### Backend (BE):
1. Chạy server Node.js:
   ```
   /backend> node server.js
   ```
2. Kích hoạt môi trường ảo (nếu sử dụng Python):
   ```
   /backend/app> venv\Scripts\activate
   ```
3. Chạy ứng dụng Python:
   ```
   (venv)/backend/app> python main.py
   ```

### Deploy bằng PM2

#### Frontend (FE):
1. Build dự án:
   ```
   /frontend> npm run build
   ```
2. Deploy bằng PM2 với port và tên tùy chọn:
   ```
   /frontend> pm2 serve build {PORT} --name "{your_FE_name}" --spa
   ```

#### Backend (BE):
1. Deploy server Node.js bằng PM2:
   ```
   /backend> pm2 start server.js
   ```
2. Kích hoạt môi trường ảo (nếu sử dụng Python):
   ```
   /backend/app> venv\Scripts\activate
   ```
3. Chạy ứng dụng Python:
   ```
   (venv)/backend/app> python main.py
   ```
note: thư mục venv sẽ ko commit, tự sao lưu và chạy
---

# Cấu trúc app 

```
app/                            
├── api/                        - Chứa các điểm cuối API của ứng dụng
│   ├── chat_endpoint.py        - Xử lý các điểm cuối API liên quan đến chat
│   ├── delete_endpoint.py      - Quản lý các thao tác xóa qua API
│   ├── doc_endpoint.py         - Xử lý các yêu cầu API liên quan đến tài liệu DOC
│   ├── pdf_endpoint.py         - Quản lý các điểm cuối API liên quan đến PDF 
│   └── xlsx_delete.py          - Xử lý xóa dữ liệu xlsx trên MySQL
|   └── xlsx_endpoint.py        - Xử lý các điểm cuối API liên quan đến tệp Excel
│
├── config.py                       - Cài đặt cấu hình
│
├── data/                           - Lưu trữ dữ liệu đã tải lên
│   └── uploaded/                   - Thư mục con cho các tệp đã tải lên
│
├── main.py                         - Triển khai ứng dụng
│
├── models/                         - Chứa các mô hình AI/ML
│   └── yolov11_tuned.pt            - Mô hình YOLOv11 đã được tinh chỉnh cho phát hiện đối tượng
│
├── pipelines/                      - Tổ chức các quy trình xử lý dữ liệu
│   ├── doc_pipelines/              - Xử lý tài liệu dạng doc, docx
│   │   └── doc_processor.py        - Logic xử lý tài liệu
│   ├── llm_pipelines/              - Xử lý ngôn ngữ lớn (LLM)
│   │   ├── agent_decision.py       - Logic ra quyết định cho agent
│   │   ├── data_preparation.py     - Chuẩn bị dữ liệu cho xử lý LLM
│   │   ├── embedding_generator.py  - Tạo embeddings từ dữ liệu
│   │   └── response_generator.py   - Tạo phản hồi bằng LLM
│   ├── pdf_pipelines/              - Xử lý tài liệu PDF
│   │   ├── gpt_ocr.py              - Sử dụng GPT để nhận diện ký tự quang học (OCR) trên PDF
│   │   ├── image_processor.py      - Xử lý hình ảnh từ PDF
│   │   ├── pdf_processor.py        - Logic xử lý tài liệu PDF
│   │   └── yolo_detector.py        - Sử dụng YOLO để phát hiện đối tượng trong hình ảnh PDF
│   ├── rag_pipelines/              - Hỗ trợ tìm kiếm nâng cao (RAG)
│   │   ├── cohere_reranker.py      - Sử dụng Cohere để xếp hạng lại kết quả
│   │   ├── search_engine.py        - Công cụ tìm kiếm sử dụng kỹ thuật RAG
│   │   └── vector_store.py         - Quản lý lưu trữ embedding vectors
│   └── xlsx_pipelines/             - Xử lý tài liệu Excel
│       └── xlsx_processor.py       - Logic xử lý tài liệu Excel
│
├── requirements.txt                - Danh sách các dependencies của dự án
│
├── tools/                          - Chứa các tool để nhúng vào Agent
│   ├── hscode.py                   - Xử lý chính cho mã HS
│   ├── hscode_status.py            - Xử lý trạng thái mã HS
│   ├── hscode_supplier.py          - Logic mã HS liên quan đến nhà cung cấp
│   ├── hscode_supplier_date_status.py - Mã HS theo nhà cung cấp, ngày và trạng thái
│   ├── hscode_supplier_daterange_status.py - Mã HS theo khoảng thời gian và trạng thái
│   ├── hscode_supplier_status.py   - Mã HS theo nhà cung cấp và trạng thái
│   ├── productname.py              - Xử lý tên sản phẩm
│   ├── supplier_resolver.py        - Giải quyết thông tin nhà cung cấp (sử dụng khớp mờ - fuzzy)
│   └──hscode_formatter.py          - format kết quả có được từ truy vấn
├── utils/                          - Cung cấp các công cụ hỗ trợ
│   └── db_connector.py             - Logic kết nối cơ sở dữ liệu
└── requirements.txt    - Danh sách các dependencies của dự án
```

# Xử lý raw data

## PDF
- Các file pdf là dạng scanned (chụp lại) nên không sử dụng các thư việc để extract text ra được
- Xử lý như dạng hình ảnh và dùng `gpt-4o` để trích xuất text ra từ ảnh (`gpt` cho kết quả chính xác hơn rất nhiều lần và có thể trích xuất tốt được những chỗ bị mờ, bị che so với các mô hình OCR khác). Nhưng bên  `open-ai` từ chối extract thông tin có chứa các chữ ký hay watermark như trong các file pdf được cung cấp (do chính sách bảo mật/an toàn bên họ)  => cách xử lý: Sẽ đưa qua một mô hình để dectect những vị trí của những chữ ký và watermark này sau đó xóa đi (finetune lại yolov11 để làm nhiệu vụ này, mô hình lưu dưới dạng pytorch : yolov11_tuned.pt, được lưu trong thư mục backend/app/models)
- prompt `gpt-ocr` để extract text
  ```python
        # Prompt hệ thống: mô tả vai trò và nhiệm vụ của AI OCR
        self.system_message = (
            "Bạn là một chuyên gia OCR có kinh nghiệm cao trong việc nhận diện và trích xuất văn bản tiếng Việt từ các tài liệu phức tạp. "
            "Bạn cần phân tích hình ảnh, nhận diện chính xác các ký tự, ngày tháng và các thông tin quan trọng khác. "
            "Kết quả đầu ra phải rõ ràng, được phân đoạn hợp lý và giữ nguyên cấu trúc gốc của tài liệu nếu có."
        )
        # Nội dung hướng dẫn cho người dùng
        self.user_text_instruction = (
            "Hãy trích xuất toàn bộ nội dung văn bản từ ảnh được cung cấp. "
            "Chú ý nhận diện các chi tiết quan trọng như ngày tháng và bất kỳ thông tin nào có liên quan."
            "Đối với những tài liệu bạn không thể nhận diện, hãy trả về thông báo 'Không thể nhận diện văn bản từ ảnh này'."
        )
  ```
- Sau khi có được text từ pdf sẽ tiến hành chunking (chia thành những đoạn nhỏ hơn). Đối với dữ liệu pdf sẽ chia mỗi chunk từ 350 đến 500 token tùy vào tổng số lượng token của cả file pdf
- Tiến hành overlap giữa các chunk để đảm bản tính liên tục và liên kết của dữ liệu (phần đầu của đoạn phía sau sẽ overlap với phần cuối của đoạn phía trước, tỷ lệ là 10%)

**Note:** Trong trường hợp xấu nhất, `gpt` không chịu extract do vẫn còn dính thông tin nhạy cảm thì lúc này sẽ sử dụng Tesseract ORC để thay thế
Lúc này `gpt` sẽ trả về 
```python 
'Không thể nhận diện văn bản từ ảnh này'
```
```python
	            word_count = len(ocr_text.split())
            if word_count < 20:
                logger.info("Số từ OCR từ GPT-4o dưới 20, chuyển sang sử dụng Tesseract.")
                # Chuyển đổi ảnh PIL thành NumPy với định dạng BGR
                img_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
                try:
                    # Sử dụng Tesseract cho văn bản tiếng Việt
                    tesseract_text = pytesseract.image_to_string(img_cv, lang='vie')
                except Exception as te:
                    logger.error(f"Lỗi khi sử dụng Tesseract: {te}")
                    tesseract_text = ""
                ocr_text = tesseract_text
```

## DOC, DOCX
## 1. Chuyển đổi File DOC sang DOCX

- **Chuyển đổi bằng LibreOffice:**
  - Chạy lệnh `soffice` với các tham số:
    - `--headless` để chạy ở chế độ không giao diện.
    - `--convert-to docx` để chuyển đổi sang định dạng DOCX.
    - `--outdir` để chỉ định thư mục đầu ra.
  - Kiểm tra kết quả và log từ LibreOffice.
  - Nếu có lỗi, in thông tin lỗi và ném ngoại lệ.

## 2. Trích xuất Nội dung File Word

- **Chuyển đổi File DOC sang DOCX**
  - Nếu file có đuôi `.doc`, chuyển đổi sang `.docx` trước khi đọc. Do các file dạng doc đã  quá lỗi thời và hầu các thư viện trích xuất tốt bây giờ không hỗ trợ
  -  Sử dụng LibreOffice để convert doc sang docx (đang cài và chạy trên local)

- **Sử dụng UnstructuredWordDocumentLoader:**
  - Dùng thư viện `langchain_community.document_loaders` để load nội dung file Word.
  - Trích xuất và trả về nội dung dưới dạng chuỗi văn bản.


- **Chia đoạn theo biểu thức chính quy:**
  - Sử dụng regex để xác định các điểm ngắt như "Điều số...", "Bổ sung...", "Khoản...", "Mẫu số", v.v.
  - Đánh dấu các điểm ngắt để phân chia văn bản thành các đoạn riêng biệt.
  - Loại bỏ các khoảng trắng thừa sau khi chia đoạn.

- **Chia nhỏ đoạn nếu các đoạn đã chia theo regex phía trên còn quá dài:**
  - Tính số lượng token của đoạn.
  - Chia đoạn thành các phần nhỏ hơn với kích thước cân bằng.

- **over lap giữa các chunk:**
  - Tỷ lệ overlap là 20% giữa đoạn hiện tại và đoạn kế tiếp.
  - Mục đích là duy trì ngữ cảnh liên tục giữa các phần đã xử lý.



##  Excel

### Note: 
Cách lưu dữ liệu excel sẽ khác với các dạng dữ liệu khác. Do yêu cầu truy xuất dữ liệu liên quan đến hs code chính xác nên việc sử dụng RAG là không thể nào đáp ứng được,  cộng với việc số lượng record rất lớn, đưa quá trình xử lý này cho LLM sẽ tốn cực nhiều token (chí phí đẩy lên cao + tốc độ rất chậm)
=> Giải pháp sử dụng: Sẽ sử dụng một method mà `open-ai` cung cấp là  **tools (functions) calling** 
 - Xây dựng một agent để quản lý và ra quyết định sử dụng các tool
 - Xây dựng các tool và logic lấy dữ liệu từ MySQL
---
### Quá trình xử lý 
- Sử dụng thư viện Pandas với engine `openpyxl` để đọc nội dung của file Excel.
- Tạo một bản sao của DataFrame và ghi nhận thông tin số lượng dòng, cột đã đọc.

- **Làm sạch ký tự không mong muốn:**
  - Loại bỏ các ký tự đặc biệt không cần thiết ở đầu và cuối chuỗi.
  - Thay thế các ký tự cụ thể bằng ký tự khác (ví dụ, chuyển đổi dấu nháy đơn và ký tự đặc biệt thành dấu phẩy hoặc chuỗi rỗng).

- **Xử lý cột dữ liệu chứa thông tin về nhà cung cấp:**
  - Điều chỉnh định dạng của chuỗi, đảm bảo dấu câu được thống nhất (chẳng hạn như chèn dấu chấm, dấu phẩy đúng vị trí).

- **Xử lý các giá trị thiếu và định dạng cột ngày tháng:**
  - Đối với các cột số, điền giá trị mặc định dưới dạng số (như NaN).
  - Đối với các cột chuỗi, thay thế giá trị thiếu bằng chuỗi rỗng.
  - Chuyển đổi các cột chứa ngày tháng sang kiểu dữ liệu datetime và chuẩn hóa định dạng ngày 

- **Thêm thông tin về nguồn dữ liệu:**
  - Thêm một cột mới để lưu trữ tên file gốc, giúp truy xuất nguồn gốc của dữ liệu. Hỗ trợ cho việc xóa dữ liệu sau này (pdf và docx cũng lưu lại tên file giống vậy)

- **Xác định và bổ sung trạng thái:**
  - Dựa trên nội dung hoặc tên các cột có sẵn, xác định trạng thái (như "Nhập" hoặc "Xuất") và gán giá trị tương ứng vào một cột mới.

- **Đổi tên cột:**
  - Đổi tên một số cột đầu tiên theo thứ tự cố định, đảm bảo dữ liệu được đồng nhất cho các bước xử lý tiếp theo.


- Kiểm tra và loại bỏ các dòng trùng lặp trong DataFrame để đảm bảo dữ liệu duy nhất.

#### Lưu Dữ Liệu Vào MySQL
  - Thiết lập kết nối tới MySQL 
  - Thực hiện chèn từng dòng dữ liệu vào bảng mục tiêu, đảm bảo chuyển đổi các giá trị (đặc biệt là cột ngày tháng) về dạng phù hợp trước khi lưu.
  - Theo dõi và log quá trình chèn dữ liệu, bao gồm số lượng dòng được insert.
  - Sau khi chèn xong, commit giao dịch và đóng kết nối tới MySQL.





# Chatbot flow


![image](https://github.com/user-attachments/assets/c621f286-b6bd-458b-a355-2cf386a7c988)




## Tool Agent 
- **Sử dụng LangChain (langchain, langchain_openai)**
  - Tạo và quản lý agent sử dụng `initialize_agent` với `AgentType.OPENAI_FUNCTIONS`.
  - Sử dụng mô hình `ChatOpenAI` để tương tác với mô hình ngôn ngữ (GPT-3.5-Turbo).
  - prompt:
    ```python
        system_prompt = (
            "Bạn là trợ lý AI chuyên phân tích truy vấn của người dùng. "
            "Xác định xem truy vấn sau có cần sử dụng tool để lấy thông tin HS code hoặc thông tin về sản phẩm, tên mặt hàng hay không."
            "Sử dụng tool khi người dùng hỏi thông tin liên quan đến hscode, thông tin liên quan đến mặt hàng,tên mặt hàng."
            "Khi người dùng hỏi về thông tin hoặc kết quả phân tích phân loại, thì không cần sử dụng tool. "
            "Trả lời chỉ là 'YES' nếu cần, hoặc 'NO' nếu không cần."
        )
        user_prompt = f"Câu hỏi: {query}"
	```
	   
## Tools

### Các kĩ thuật sử dụng:
**Fuzzy Matching**
**SupplierResolver:** Sử dụng rapidfuzz để so khớp gần đúng tên nhà cung cấp:
Kỹ thuật: Dùng fuzz.WRatio để tính độ tương đồng giữa chuỗi đầu vào và danh sách nhà cung cấp.

**Threshold:** Lọc kết quả với điểm số >= 80, ưu tiên khớp chính xác nếu >= 90%.
Ứng dụng: Xử lý đầu vào không chính xác từ người dùng, trả về danh sách nhà cung cấp phù hợp nếu trường hợp chỉ tìm được một nhà cung cấp phù hợp thì thực hiện tiếp truy vấn của người dùng và  trả về kết quả

**Tìm kiếm FULLTEXT (áp dụng khi người dùng cung cấp thông tin tên hoặc mô tả của mặt hàng)**
**MATCH ... AGAINST:** Trong ProductNameSearchTool,  sử dụng cú pháp MATCH ... AGAINST với chế độ NATURAL LANGUAGE MODE để thực hiện tìm kiếm trên trường tên sản phẩm (TenHang). Phương pháp này cho phép truy vấn dữ liệu dựa trên ngữ cảnh tự nhiên của từ khóa, giúp xác định các bản ghi có liên quan đến truy vấn của người dùng.

**Fuzzy Filtering:** Sau khi thực hiện truy vấn FULLTEXT, các kết quả phải đạt một ngưỡng cố định ( 80% độ tương đồng fuzzy) mới được chấp nhận. Ngưỡng này được thiết lập nhằm đảm bảo rằng chỉ những kết quả có độ liên quan cao mới được trả về

## Generate LLM (mô hình sinh câu trả lời)
- **Xử lý Tài liệu (Document) và RAG**
  - Khi có tài liệu liên quan, tích hợp nội dung và metadata từ các tài liệu để sinh câu trả lời theo mô hình RAG (Retrieval-Augmented Generation).
  - Nếu không có tài liệu, sinh câu trả lời dựa trên kiến thức chung của mô hình.

- **Định dạng Markdown**
  - Trả về câu trả lời dưới dạng Markdown theo yêu cầu, đảm bảo câu trả lời súc tích và đúng trọng tâm.
 
prompt:
```python
        if not docs:
            # Fallback: không có docs
            system_prompt = (
                "Bạn là một trợ lý ảo thân thiện và đáng tin cậy được công ty của chúng tôi giao nhiệm vụ giả làm AI để giúp người dùng với các câu hỏi về hàng hóa, hải quan, và xuất nhập cảnh.\n"
                "Nhưng đây là trường hợp không tìm được tài liệu liên quan đến câu hỏi của người dùng, nên bạn có kiến thức chung về mọi lĩnh vực.\n"
                "Hãy trả lời trực tiếp câu hỏi của người dùng, chỉ đưa ra kết quả chính xác.\n"
                "Trả lời dưới dạng Markdown, không cần mở đầu như 'Dựa trên...' hay 'Theo tài liệu...'.\n"
                "Nếu câu trả lời có code, đặt trong khối triple backticks.\n"
                "Không tiết lộ phác thảo nội bộ (chain-of-draft).\n"
                "\n"
            )

            user_prompt = (
                f"**Người dùng hỏi**: {escaped_query}\n\n"
                "Hãy tuân thủ các yêu cầu ở trên, trả lời súc tích và đúng trọng tâm, sử dụng Markdown.\n"
                "Hãy tuân thủ yêu cầu trên: mở đầu gọn, nội dung chính, kết luận với câu hỏi thân thiện."
            )

        else:
            # Có docs => RAG logic
            system_prompt = (
                "Bạn là một trợ lý ảo đáng tin cậy, chuyên về hàng hóa, hải quan, và xuất nhập cảnh.\n"
                "Nhiệm vụ của bạn là hỗ trợ người dùng với các câu hỏi chuyên sâu trong lĩnh vực này.\n"
                "Trả lời dựa trên tài liệu cung cấp, trình bày bằng Markdown.\n"
                "Không tiết lộ phác thảo nội bộ (chain-of-draft).\n"
                "Không bịa thông tin.\n"
            )

            # Xây dựng chuỗi tài liệu với metadata
            docs_with_metadata = []
            for doc in docs:
                meta = doc.metadata if hasattr(doc, "metadata") else {}
                file_name = meta.get("file_name", "Unknown")
                file_type = meta.get("file_type", "").lower()
                source = f"{file_name}{file_type}".strip()
                content = doc.page_content.replace("{", "{{").replace("}", "}}")
                docs_with_metadata.append(
                    f"**Tên file**: {source}\n**Loại file**: {file_type}\n**Nội dung**:\n{content}"
                )
            docs_str = "\n\n".join(docs_with_metadata)

            user_prompt = (
                f"**Tài liệu (sắp xếp theo thứ tự liên quan giảm dần)**:\n{docs_str}\n\n"
                "### Nhiệm vụ\n"
                f"- Người dùng hỏi: {escaped_query}\n"
                "Hãy trả lời trực tiếp nội dung, không cần viết 'Dựa trên tài liệu...' hay 'Theo tài liệu...'.\n"
                "Nếu tài liệu là PDF (file_type = 'pdf'), hãy trình bày câu trả lời theo cấu trúc:\n"
                "\n"
                "kết quả phân tích phân loại {{tên file pdf}} nội dung là:\n"
                "{{nội dung response từ top docs}}\n"
                "\n"
                "Nếu có nhiều file PDF, lặp lại cấu trúc này cho từng file.\n"
                "Hãy tuân thủ yêu cầu trên: mở đầu gọn, nội dung chính, kết luận với câu hỏi thân thiện."
            )
```



## Cách triển khai ứng dụng

Để giảm tối đa độ trễ khi phản hồi.  Sử dụng Object Pooling để tạo trước một tập hợp các đối tượng có thể tái sử dụng (reusable objects) và quản lý chúng trong một "pool". Khi cần, ứng dụng lấy một đối tượng từ pool, sử dụng xong thì trả lại thay vì tạo mới hoặc hủy bỏ

Tạo một pool  gồm nhiều đối tượng (VectorStoreManager, SearchEngine, AsyncCohereReranker, và ToolAgent) và quản lý chúng bằng các queue (asyncio.Queue)

Hiện tại khi chạy ứng dụng sẽ khởi tạo:
- 6 đối tượng VectorStoreManager, SearchEngine
- 6 đối tượng Reranker
- 10 đối tượng ToolAgent

**Note:** các tham số cấu hình này có thể thay đổi trong file backend/app/config.py
# Các ứng dụng, gói ngoài cần cài đặt
-  **LibreOffice**
  Hỗ trợ chuyển đổi file định dạng `.doc` sang `.docx`

-  **Tesseract ORC**
Extract text từ ảnh, đề phòng trường hợp `gpt` không chịu extract
# Hướng dẫn chạy Scripts App

**Khi chạy trên môi trường mới:**

- **Cần tạo môi trường cho ứng dụng Python:**
  - Chuyển đến thư mục `app`:
  
    ```bash
    cd đường-dẫn/đến/thư-mục/app
    ```
    
  - Tạo môi trường ảo mới:
    - **Trên macOS/Linux:**
  
      ```bash
      python3 -m venv venv
      ```
  
    - **Trên Windows (Terminal/CMD):**
  
      ```cmd
      python -m venv venv
      ```
  
    - **Trên Windows (PowerShell):**
  
      ```powershell
      python -m venv venv
      ```

- **Kích hoạt môi trường ảo:**
  - **Trên macOS/Linux:**
  
    ```bash
    source venv/bin/activate
    ```
  
  - **Trên Windows (Terminal/CMD):**
  
    ```cmd
    venv\Scripts\activate
    ```
  
  - **Trên Windows (PowerShell):**
  
    ```powershell
    .\venv\Scripts\Activate.ps1
    ```

- **Cài đặt Dependencies:**

  Sau khi kích hoạt môi trường ảo, cài đặt các gói cần thiết từ file `requirements.txt`:
  
  ```bash
  pip install -r requirements.txt
  ```
- **Chạy Scripts ứng dụng**
	```bash
	python main.py
	```
