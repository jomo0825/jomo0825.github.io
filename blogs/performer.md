# 論文標題：Rethinking Attention with Performers (ICLR 2021)

**作者**：Krzysztof Choromanski∗, Valerii Likhosherstov∗, David Dohan∗, Xingyou Song∗,  
Andreea Gane∗, Tamas Sarlos∗, Peter Hawkins∗, Jared Davis, Afroz Mohiuddin,  
Lukasz Kaiser, David Belanger, Lucy Colwell, Adrian Weller :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}

**機構**：Google, University of Cambridge, DeepMind, Alan Turing Institute :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}

---

## 摘要  
- **核心貢獻**：提出 Performer，一種基於 **FAVOR+**（Fast Attention Via positive Orthogonal Random features）機制的 Transformer 架構，可在 **線性** 空間與時間複雜度下，無需先驗假設（如稀疏或低秩），依然「可證明地」逼近 Softmax 注意力。 :contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5}  
- **FAVOR+**：不僅適用於 Softmax 核，還能高效建模其他可核化的注意力機制，並提供無偏或近無偏的估計、均勻收斂與低方差保證。 :contentReference[oaicite:6]{index=6}:contentReference[oaicite:7]{index=7}  
- **實驗驗證**：在像素預測、語言模型與蛋白質序列建模等多個大規模任務上，與現有稀疏或低秩注意力方法相比，展現出競爭性效果。 :contentReference[oaicite:8]{index=8}:contentReference[oaicite:9]{index=9}

---

## 1. 引言與相關工作  
1. **傳統 Transformer 的瓶頸**  
   - 計算與存儲複雜度均為 O(L²)（L = 序列長度），難處理長序列或資源受限場景。 :contentReference[oaicite:10]{index=10}:contentReference[oaicite:11]{index=11}  
2. **現有解法**  
   - 局部注意力、稀疏化（LSH、滑動窗口）、池化、聚類、低秩核等，但多依賴先驗限制或缺乏嚴格理論保證。 :contentReference[oaicite:12]{index=12}:contentReference[oaicite:13]{index=13}  
3. **本工作定位**  
   - 首次提出在不犧牲表示能力的前提下，以線性複雜度「可證明地」逼近全秩 Softmax 注意力的新架構。 :contentReference[oaicite:14]{index=14}:contentReference[oaicite:15]{index=15}

---

## 2. FAVOR+ 機制與正交隨機特徵  
### 2.1 正規注意力機制回顧  
- **雙向（Bidirectional）注意力**  
  $$\mathrm{Att}_{\leftrightarrow}(Q,K,V) \;=\; D^{-1} \exp\!\bigl(QK^\top/\sqrt{d}\bigr)\,V,\quad D=\mathrm{diag}\bigl(\exp(QK^\top/\sqrt{d})\mathbf{1}\bigr)\,. $$  
  複雜度 O(L²d)、空間 O(L²+Ld)。 :contentReference[oaicite:16]{index=16}:contentReference[oaicite:17]{index=17}  
- **單向（Unidirectional）注意力**  
  類似形式，僅考慮下三角矩陣 tril(A)。 :contentReference[oaicite:18]{index=18}:contentReference[oaicite:19]{index=19}  

### 2.2 可核化注意力的隨機特徵映射  
- **核化形式**：  
  $$A_{ij}=K(q_i,k_j)=\mathbb{E}[\phi(q_i)^\top\phi(k_j)]\,,\quad \phi:\mathbb{R}^d\to\mathbb{R}^r_+\,. $$  
- **近似注意力**：  
  $$\widehat{\mathrm{Att}}(Q,K,V) = \widehat D^{-1}\bigl(\phi(Q)\phi(K)^\top V\bigr),\quad \widehat D=\mathrm{diag}\bigl(\phi(Q)\phi(K)^\top\mathbf{1}\bigr)\,. $$  
  複雜度 O(L r d)、空間 O(L r+Ld+rd)。 :contentReference[oaicite:20]{index=20}:contentReference[oaicite:21]{index=21}  

### 2.3 Softmax 核的正向隨機特徵  
- 傳統三角函數映射會導致在小值區域高方差，產生負 renormalizer 或訓練不穩定。 :contentReference[oaicite:22]{index=22}:contentReference[oaicite:23]{index=23}  
- **Lemma 1**（Positive RFs for Softmax）：  
  $$\exp(q^\top k)=\mathbb{E}_{\omega\sim\mathcal{N}(0,I)}\bigl[\exp(\omega^\top q-\|q\|^2/2)\,\exp(\omega^\top k-\|k\|^2/2)\bigr]\,. $$  
  基於此可構建 **正向**、**無偏** 隨機特徵映射，方差在低相關時趨近於 0。 :contentReference[oaicite:24]{index=24}:contentReference[oaicite:25]{index=25}  

### 2.4 正交隨機特徵（ORFs）  
- 通過 Gram–Schmidt 對多組隨機向量正交化，進一步降低估計方差，允許在 m≤d 時顯著減少特徵數量。 :contentReference[oaicite:26]{index=26}:contentReference[oaicite:27]{index=27}  

---

## 3. 理論分析  
- **Lemma 2**：比較三角 vs. 正向隨機特徵的 MSE，證明正向方法在 SM→0 時方差更低。 :contentReference[oaicite:28]{index=28}:contentReference[oaicite:29]{index=29}  
- **Theorem 1**：正規化 Softmax 核（SMREG）在任何維度下近似 Softmax，提供下界保證。 :contentReference[oaicite:30]{index=30}:contentReference[oaicite:31]{index=31}  
- **Theorem 2**：在任意 d>0 下，ORFs 對正向隨機特徵的 MSE 優於無正交化版本。 :contentReference[oaicite:32]{index=32}:contentReference[oaicite:33]{index=33}  
- **Theorem 3**：給出 SMREG 與 ORFs 的尾部概率指數收斂界。 :contentReference[oaicite:34]{index=34}:contentReference[oaicite:35]{index=35}  
- **Theorem 4**：在特定 m=Θ(d δ⁻² log(...)) 下，可保證注意力矩陣的 ∞–范數誤差 ≤ε。 :contentReference[oaicite:36]{index=36}:contentReference[oaicite:37]{index=37}  

---

## 4. 實驗驗證  
### 4.1 計算成本  
- Performer 在大 L 下達到近線性時間與次二次內存，接近理想「返回 V 矩陣」的速度上限。 :contentReference[oaicite:38]{index=38}:contentReference[oaicite:39]{index=39}  

### 4.2 注意力近似誤差  
- 實驗證明：ORFs < IID，正向 RF < 三角 RF，驗證 FAVOR+ 的低誤差特性。 :contentReference[oaicite:40]{index=40}:contentReference[oaicite:41]{index=41}  

### 4.3 與預訓練 Transformer 的 Softmax 兼容性  
- 在 LM1B 上，Performer 可微調回復預訓練效果；在 PG-19 上，僅正向 RF＋重抽樣 才能匹配原 Transformer。 :contentReference[oaicite:42]{index=42}:contentReference[oaicite:43]{index=43}  

### 4.4 蛋白質序列建模  
- 36 層 Performer 在 TrEMBL 上優於 Reformer、Linformer；使用 ReLU 核（Performer-RELU）可進一步提升。 :contentReference[oaicite:44]{index=44}:contentReference[oaicite:45]{index=45}  

### 4.5 超長序列訓練  
- 在 ImageNet64 (L=12288) 與拼接 TrEMBL (L=8192) 任務中，Performer 能以標準架構達到或超越其他方法性能。 :contentReference[oaicite:46]{index=46}:contentReference[oaicite:47]{index=47}  

---

## 5. 結論  
- Performer 提供首個 **線性**、**無偏**、**可證明** 的 Softmax 注意力逼近方案，兼容現有 Transformer 並顯著擴展長序列應用場景。 :contentReference[oaicite:48]{index=48}:contentReference[oaicite:49]{index=49}  

---

## 6. 廣泛影響  
- **生物醫學**：允許處理超長蛋白質序列，推動蛋白質相互作用預測與 vaccine 設計。  
- **環境**：大幅降低訓練/推理能耗與碳排放。  
- **Transformer 研究**：為高效 Transformer 提供理論基礎與新視角。  
- **跨領域注意力**：可應用於圖網絡、圖像處理、強化學習等多種場景。 :contentReference[oaicite:50]{index=50}:contentReference[oaicite:51]{index=51}  

---

> **註**：完整參考文獻列表請見原論文 Appendix。  
